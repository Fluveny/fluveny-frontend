import { cn } from '@/app/utils/cn';
import { Back } from '@/components/back';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/templates/loading-screen';
import { Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Tag } from '../components/tag';
import { useGetModuleStudentOverview } from '../hooks/api/queries/use-get-module-student-overview';

export const ModuleVisualizationPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const { data: module, isLoading } = useGetModuleStudentOverview(moduleId);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // TODO: add endpoint to favorite model
  const handleFavoriteModule = () => {
    console.log('modulo favoritado');
  };

  // TODO: add start module method
  const handleStartModule = () => {
    console.log(`modulo ${moduleId} iniciado`);
  };

  return (
    <>
      <div className="relative">
        <div className="h-50 w-full bg-[url(/img/party.webp)] bg-cover bg-center" />
        <Back
          className="absolute -bottom-6 left-4 z-10"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className="mx-auto flex w-full max-w-300 flex-col px-4 pb-8">
        <button
          className="group mt-10 mb-4 ml-auto flex cursor-pointer"
          onClick={handleFavoriteModule}
        >
          <Star
            className={cn(
              'size-10 stroke-zinc-500 stroke-[1px] group-hover:fill-amber-300',
              { 'fill-amber-300 stroke-amber-300': module?.isFavorite },
            )}
          />
        </button>

        <h2 className="text-center text-4xl font-bold">{module?.title}</h2>
        <ul className="mt-2 flex justify-center gap-4">
          {module?.grammarRules.map((g) => {
            return <Tag key={g.id} name={g.title} variant="blue" />;
          })}
        </ul>
        <p className="mt-4 text-lg">{module?.description}</p>
        <div className="mt-10 flex justify-center gap-4">
          <div className="space-y-2">
            <div className="bg-primary flex h-16 w-32 items-center justify-center rounded-md text-xl text-white">
              {module?.level.title}
            </div>
            <span className="block text-center text-zinc-800">Dificuldade</span>
          </div>
          <div className="space-y-2">
            <div className="bg-primary flex h-16 w-32 items-center justify-center rounded-md text-xl text-white">
              {module?.progressPercentage}%
            </div>
            <span className="block text-center text-zinc-800">Acertos</span>
          </div>
        </div>
        <Button
          className="text-bold mt-10 w-full py-8 text-2xl text-white"
          type="button"
          onClick={handleStartModule}
        >
          Iniciar
        </Button>
      </div>
    </>
  );
};
