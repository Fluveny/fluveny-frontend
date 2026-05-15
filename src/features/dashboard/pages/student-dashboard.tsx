import { ROUTES } from '@/app/configs/routes';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { useGetModules } from '@/features/module/hooks/api/queries/use-get-modules';
import { LoadingScreen } from '@/templates/loading-screen';
import { NotFound } from '@/templates/not-found';
import { CheckCheck, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DashboardCarousel } from '../components/carousel';
import { DashboardHeader } from '../components/header';
import { SubTitle } from '../components/subtitle';

export const StudentDashboard = () => {
  const { modules, isLoading, isError } = useGetModules();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !modules) {
    return <NotFound />;
  }

  return (
    <div className="flex w-full flex-col gap-8 p-6 md:p-8">
      <DashboardHeader
        username={user?.name}
        title="Volte de onde você parou."
        description="Continue trabalhando no seu progresso"
      />

      <div className="w-full px-8 md:px-12 lg:px-16">
        <DashboardCarousel
          modules={modules}
          extraCard={
            <button
              onClick={() => navigate(ROUTES.modules)}
              className="border-primary/40 bg-background text-primary hover:bg-primary/5 flex h-full min-h-60 w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition-colors lg:min-h-70"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-medium">
                  Explore outros módulos
                </span>
                <Search className="h-5 w-5" />
              </div>
            </button>
          }
        />
      </div>

      <div className="ml-auto flex w-full flex-col gap-4 self-end sm:w-1/2 lg:w-1/3">
        <SubTitle
          title="Veja o seu progresso"
          description="Confira como você se saiu durante esse último mês:"
          className="text-right"
        />

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="flex items-center gap-4">
              <CheckCheck className="text-primary" />
              <div className="flex flex-col">
                <span className="text-primary text-2xl font-bold">84%</span>
                <span className="text-muted-foreground text-sm">
                  de acertos
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <Clock className="text-primary" />
              <div className="flex flex-col">
                <span className="text-primary text-2xl font-bold">380min</span>
                <span className="text-muted-foreground text-sm">estudados</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
