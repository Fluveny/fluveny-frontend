import type { UserRole } from '@/@types/user';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';

interface ProtectedRouteProps {
  permittedRoles: UserRole[];
  redirect: string;
  children?: ReactNode;
}

export const ProtectedRoute = ({
  permittedRoles,
  redirect,
  children,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized = user && permittedRoles.includes(user.role);
  if (!isAuthorized) {
    return <Navigate to={redirect} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
