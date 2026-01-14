import { useAuth } from '@/hooks/useAuth';
import { ArenaPage } from '@/pages/ArenaPage';
import { Redirect } from 'expo-router';

export default function Arena() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <ArenaPage />;
}