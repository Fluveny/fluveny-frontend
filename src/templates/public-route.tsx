import { ROUTES } from '@/app/configs/routes';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { LoadingScreen } from './loading-screen';

type PublicRouteProps = {
  children: ReactNode;
};

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const from = location.state?.from?.pathname || ROUTES.dashboard;

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
