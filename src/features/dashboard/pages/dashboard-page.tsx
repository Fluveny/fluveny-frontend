import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { CreatorDashboard } from './creator-dashboard';
import { StudentDashboard } from './student-dashboard';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  if (user?.role === 'CONTENT_CREATOR') {
    return <CreatorDashboard />;
  }

  return <StudentDashboard />;
};
