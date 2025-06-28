import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserContext';

export const useAuth = (requireAuth = false) => {
  const { user, isAuthenticated, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, requireAuth, isAuthenticated, router]);

  return {
    user,
    isAuthenticated,
    loading,
    isReady: !loading,
  };
};

export const useProtectedRoute = () => {
  return useAuth(true);
};