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

// 导出用于 TRPC 或其他 HTTP 请求的 fetch 包装
  export { fetchWithAuth } from "./auth-interceptor";

