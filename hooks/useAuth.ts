/**
 * Better Auth - useAuth Hook
 */
import { signOut, useSession } from '@/lib/auth-client'
import { router } from 'expo-router'

export const useAuth = () => {
  const { data: session, isPending, error } = useSession()

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            // 清除所有 auth 相关的 URL 参数，使用 replace 避免返回
            router.replace('/login')
          },
          onError: (error) => {
            console.error('[useAuth] Logout failed:', error)
            // 即使登出失败也跳转到登录页
            router.replace('/login')
          }
        }
      })
    } catch (error) {
      console.error('[useAuth] Logout failed:', error)
      // 即使发生异常也跳转到登录页
      router.replace('/login')
    }
  }

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
    loading: isPending,
    isAuthenticated: !!session?.user,
    error,
    logout: handleLogout,
  }
}
