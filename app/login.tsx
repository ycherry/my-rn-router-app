import { useAuth } from '@/hooks/useAuth';
import { LoginPageContent } from '@/pages/LoginPage/LoginPageContent';
import { LoginPageStoreProvider } from '@/pages/LoginPage/_store';
import { Redirect } from 'expo-router';

export default function Login() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  if (isAuthenticated) {
    return <Redirect href="/arena" />;
  }

  return (
    <LoginPageStoreProvider>
      <LoginPageContent />
    </LoginPageStoreProvider>
  );
}