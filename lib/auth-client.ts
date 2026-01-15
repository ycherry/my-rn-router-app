/**
 * Better Auth Client Configuration
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAuthClient } from "better-auth/react";
import { getEnv } from "./env";

export const authClient = createAuthClient({
  baseURL: (typeof globalThis === "undefined" || !globalThis.location) 
    ? getEnv().VITE_APP_URL || "http://192.168.1.5:8000"
    : globalThis.location.origin,
  // 启用自动刷新 token
  fetchOptions: {
    credentials: "include", // 确保携带 cookies
  },
  // Token 自动刷新配置
  session: {
    // 在 token 过期前 5 分钟自动刷新
    refreshOnWindowFocus: true, // 窗口获得焦点时刷新
    refreshInterval: 60 * 10, // 每 10 分钟检查一次 (单位：秒)
  },
});

// Export hooks and methods
export const { useSession } = authClient;

// Convenient sign in/out functions
const clearAuthStorage = async () => {
  try {
    // 清除 AsyncStorage 中的 auth 数据
    const allKeys = await AsyncStorage.getAllKeys();
    const authKeys = allKeys.filter(key => 
      key.includes('auth') || key.includes('session') || key.includes('token') || key.includes('better-auth')
    );
    if (authKeys.length > 0) {
      await AsyncStorage.multiRemove(authKeys);
    }
  } catch (error) {
    console.warn('[Auth] Failed to clear storage:', error);
  }
};

export const signInWithGitHub = async (callbackURL?: string) => {
  await clearAuthStorage();
  
  return authClient.signIn.social({ 
    provider: "github",
    callbackURL: callbackURL || "/(tabs)",
    errorCallbackURL: "/login",
  });
};

export const signInWithGoogle = async (callbackURL?: string) => {
  await clearAuthStorage();
  
  return authClient.signIn.social({ 
    provider: "google",
    callbackURL: callbackURL || "/(tabs)",
    errorCallbackURL: "/login",
  });
};

export const signOut = async (options?: { fetchOptions?: { onSuccess?: () => void; onError?: (error: unknown) => void } }) => {
  try {
    // 执行 Better Auth 的登出
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          // 清除所有 auth 相关的 storage
          await clearAuthStorage();
          
          options?.fetchOptions?.onSuccess?.();
        },
        onError: (error) => {
          console.error('[Auth] SignOut error:', error);
          options?.fetchOptions?.onError?.(error);
        }
      }
    });
  } catch (error) {
    console.error('[Auth] SignOut failed:', error);
    throw error;
  }
};

export { authClient as auth };

// Token 刷新锁，防止并发请求时多次刷新
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// 保存原始 fetch
let originalFetch: typeof fetch = globalThis.fetch;

// Flag to prevent recursion
let isIntercepting = false;

// 订阅 token 刷新完成事件
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 通知所有订阅者 token 已刷新
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Fetch 拦截器 - 自动处理 401 错误并刷新 token
 */
export const fetchWithAuth = async (
  url: string | URL | Request,
  options?: RequestInit
): Promise<Response> => {
  const urlString =
    typeof url === "string"
      ? url
      : url instanceof URL
        ? url.toString()
        : url.url;

  // Don't intercept auth endpoints to prevent recursion
  if (urlString.includes("/api/auth/")) {
    return originalFetch(url, options);
  }

  const requestOptions: RequestInit = {
    ...options,
    credentials: "include", // 确保携带 cookies
  };

  const response = await originalFetch(url, requestOptions);

  // 如果返回 401，尝试刷新 token
  if (response.status === 401) {
    if (isRefreshing) {
      // 如果正在刷新，等待刷新完成
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(originalFetch(url, requestOptions));
        });
      });
    } else {
      isRefreshing = true;

      try {
        // 调用 Better Auth 的 session 刷新
        const session = await authClient.getSession();

        if (session.data) {
          isRefreshing = false;
          onTokenRefreshed("refreshed");

          // 重新发起原始请求
          return originalFetch(url, requestOptions);
        } else {
          // Session 无效，跳转到登录页
          isRefreshing = false;
          globalThis.location.href = "/login";
          throw new Error("Session expired");
        }
      } catch (error) {
        isRefreshing = false;
        throw error;
      }
    }
  }

  return response;
};

/**
 * 为已存在的 fetch 调用添加拦截
 * 在应用初始化时调用
 */
export const setupAuthInterceptor = () => {
  // 保存原始 fetch (只保存一次)
  if (!originalFetch) {
    originalFetch = globalThis.fetch;
  }

  // 重写 window.fetch
  globalThis.fetch = async function (
    url: string | URL | Request,
    options?: RequestInit
  ): Promise<Response> {
    // Prevent recursion
    if (isIntercepting) {
      return originalFetch(url, options);
    }

    isIntercepting = true;
    try {
      // 只拦截 API 请求
      const urlString =
        typeof url === "string"
          ? url
            : url instanceof URL
              ? url.toString()
              : url.url;

      // Don't intercept auth endpoints to prevent infinite recursion
      if (urlString.includes("/api/auth/")) {
        return originalFetch(url, options);
      }

      if (urlString.includes("/api/")) {
        return fetchWithAuth(url, options);
      }

      // 其他请求使用原始 fetch
      return originalFetch(url, options);
    } finally {
      isIntercepting = false;
    }
  };
};

