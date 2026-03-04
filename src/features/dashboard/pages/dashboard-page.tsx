import { useAuthStore } from "@/features/authentication/stores/auth-store";
import { CreatorDashboard } from "../components/creator-dashboard";
import { StudentDashboard } from "../components/student-dashboard";

export const DashboardPage = () => {
  const { user } = useAuthStore();

  if (user?.role === 'CONTENT_CREATOR') {
    return <CreatorDashboard />;
  }

  return <StudentDashboard />;
};
