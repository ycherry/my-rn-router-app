import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Refine } from '@refinedev/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { authClient } from '@/lib/auth-client';
import '@/lib/i18n'; // 初始化 i18n
import '../global.css'; // 导入全局样式

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {
        /* ignore errors when hiding splash screen */
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/arena');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading]);

  const queryClient = new QueryClient();
  
  // 获取认证 headers 和 cookies
  const getAuthConfig = async () => {
    try {
      const session = await authClient.getSession();
      console.log('[DataProvider] Session token:', session?.data?.session?.token);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // 使用 session 中的 token 构建 Cookie header
      if (session?.data?.session?.token) {
        // Better Auth 使用 session token 作为 cookie
        headers['Cookie'] = `better-auth.session_token=${session.data.session.token}`;
        console.log('[DataProvider] Added Cookie header with token');
      } else {
        console.log('[DataProvider] No session token found');
      }
      
      console.log('[DataProvider] Final headers:', headers);
      return headers;
    } catch (error) {
      console.error('[DataProvider] Error getting auth config:', error);
      return {
        'Content-Type': 'application/json',
      };
    }
  };

  // 重写 dataProvider 的方法以包含认证信息
  const authenticatedDataProvider = {
    getList: async (params: any) => {
      const headers = await getAuthConfig();
      const response = await fetch(
        `http://localhost:8000/api/${params.resource}`,
        {
          credentials: 'include',
          headers,
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }
      
      const data = await response.json();
      return data;
    },
    getOne: async (params: any) => {
      const headers = await getAuthConfig();
      const response = await fetch(
        `http://localhost:8000/api/${params.resource}/${params.id}`,
        {
          credentials: 'include',
          headers,
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }
      
      const data = await response.json();
      return data;
    },
    create: async (params: any) => {
      const headers = await getAuthConfig();
      // 特殊处理 votes 资源，只发送 implementationId
      const body = params.resource === 'votes' 
        ? JSON.stringify({ implementationId: params.variables.implementationId })
        : JSON.stringify(params.values);

      console.log('[DataProvider] Creating resource:', params.resource);
      console.log('[DataProvider] Raw params.values:', params.values);
      console.log('[DataProvider] Stringified body:', body);
      
      const response = await fetch(
        `http://localhost:8000/api/${params.resource}`,
        {
          method: 'POST',
          credentials: 'include',
          headers,
          body,
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        console.error('[DataProvider] Create failed:', error);
        throw new Error(error.error || 'Request failed');
      }
      
      const data = await response.json();
      console.log('[DataProvider] Create success:', data);
      return { data };
    },
    update: async (params: any) => {
      const headers = await getAuthConfig();
      const response = await fetch(
        `http://localhost:8000/api/${params.resource}/${params.id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers,
          body: JSON.stringify(params.values),
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }
      
      const data = await response.json();
      return data;
    },
    deleteOne: async (params: any) => {
      const headers = await getAuthConfig();
      const response = await fetch(
        `http://localhost:8000/api/${params.resource}/${params.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers,
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }
      
      const data = await response.json();
      return data;
    },
    getApiUrl: () => 'http://localhost:8000/api',
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Refine dataProvider={authenticatedDataProvider}>
        <SafeAreaProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen name="arena" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </SafeAreaProvider>
      </Refine>
    </QueryClientProvider>
  );
}
