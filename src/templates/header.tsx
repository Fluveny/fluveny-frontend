import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { PrivateHeader } from '../components/private-header';
import { PublicHeader } from '../components/public-header';

export const Header = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <PrivateHeader /> : <PublicHeader />;
};
