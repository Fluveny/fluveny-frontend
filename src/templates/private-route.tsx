import type { UserRole } from '@/@types/user';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import type { ReactNode } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router';

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
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.isActive === false) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="bg-background/80 absolute inset-0 z-0 backdrop-blur-sm" />
        <AlertDialog open={true}>
          <AlertDialogContent className="z-50">
            <AlertDialogHeader>
              <AlertDialogTitle>Conta Desativada</AlertDialogTitle>
              <AlertDialogDescription>
                Sua conta foi desativada pela administração. Caso tenha algum
                problema ou acredite que isso seja um erro, por favor, entre em
                contato com a administradora.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  logout();
                  navigate('/login', { replace: true });
                }}
              >
                Voltar para o Login
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="pointer-events-none absolute inset-0 z-[-1] opacity-50 blur-sm">
          {children ? children : <Outlet />}
        </div>
      </div>
    );
  }

  const isAuthorized = user && permittedRoles.includes(user.role);
  if (!isAuthorized) {
    return <Navigate to={redirect} replace />;
  }

  const isOnboardingRoute = window.location.pathname === '/onboarding';
  if (
    user &&
    !user.name &&
    !user.requiresPasswordReset &&
    user.role === 'STUDENT' &&
    !isOnboardingRoute
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
