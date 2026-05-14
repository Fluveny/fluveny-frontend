import { ROUTES } from '@/app/configs/routes';
import { Button } from '@/components/ui/button';
import { useGetModules } from '@/features/module/hooks/api/queries/use-get-modules';
import { LoadingScreen } from '@/templates/loading-screen';
import { NotFound } from '@/templates/not-found';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DashboardCarousel } from '../components/carousel';
import { DashboardHeader } from '../components/header';
import { SubTitle } from '../components/subtitle';

export const CreatorDashboard = () => {
  const { modules, isLoading, isError } = useGetModules();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !modules) {
    return <NotFound />;
  }

  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      <DashboardHeader
        title="Volte de onde você parou"
        username="Joe Doe"
        description="Seus últimos módulos nos rascunhos:"
      />
      <div className="w-full px-8 md:px-12 lg:px-16">
        <DashboardCarousel
          modules={modules}
          extraCard={
            <button
              onClick={() => navigate(`${ROUTES.modules}/${ROUTES.create}`)}
              className="border-primary/40 bg-background text-primary hover:bg-primary/5 flex h-full min-h-60 w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition-colors lg:min-h-70"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-medium">Criar novo módulo</span>
                <Plus className="h-5 w-5" />
              </div>
            </button>
          }
        />
      </div>

      <div className="ml-auto flex w-full flex-col gap-4 self-end sm:w-1/2 lg:w-1/3">
        <SubTitle
          title="Comece a criar conteúdo"
          description="Veja o que há para fazer:"
          className="text-right"
        />
        <Button onClick={() => navigate(`${ROUTES.modules}/${ROUTES.create}`)}>
          Criar Novo Módulo
        </Button>
        <Button onClick={() => navigate(`${ROUTES.modules}/${ROUTES.drafts}`)}>
          Ver meus rascunhos
        </Button>
      </div>
    </div>
  );
};
