import { useGetUserInformation } from '@/features/authentication/hooks/use-get-user-information';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { LoadingScreen } from '@/templates/loading-screen';
import { useEffect, type ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: response,
    isSuccess,
    isLoading,
    isError,
  } = useGetUserInformation();
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    }

    if (isSuccess) {
      setUser(response.data);
      setIsLoading(false);
    }

    if (isError) {
      setUser(null);
      setIsLoading(false);
    }
  }, [isLoading, isSuccess, isError, response, setUser, setIsLoading]);

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
