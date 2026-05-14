import { useNavigate, useParams } from 'react-router';
import { useGetAllGrammarRule } from '../hooks/api/queries/use-get-all-grammar-rule';
import { usePublishModule } from '../hooks/api/mutations/use-publish-module';
import { NavigationSectionsSkeleton } from './navigation-sections-skeleton';
import { SectionButton } from './section-button';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/app/configs/routes';

export const NavigationSections = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { mutate: publishModule, isPending } = usePublishModule();

  const { data, isLoading, isError } = useGetAllGrammarRule(moduleId);

  if (isLoading) return <NavigationSectionsSkeleton />;

  if (isError || !data) {
    return (
      <footer className="bg-destructive fixed bottom-0 left-0 w-full px-8 py-4 text-center text-sm text-white">
        Erro ao carregar seções do módulo.
      </footer>
    );
  }

  return (
    <footer className="custom-scrollbar bg-primary fixed bottom-0 left-0 w-full overflow-x-auto">
      <div className="flex w-full items-center justify-center gap-4 px-8 py-4">
        <SectionButton variant="introduction" title="Introdução" />
        {data.map((gr, index) => {
          return (
            <SectionButton
              title={gr.title}
              grammarRuleId={gr.id}
              variant="grammarRule"
              key={index}
            />
          );
        })}
        <SectionButton title="Desafio Final" variant="finalChallenge" />
        <Button
          onClick={() => {
            if (moduleId) {
              publishModule(moduleId, {
                onSuccess: () => navigate(`${ROUTES.modules}/${moduleId}`),
              });
            }
          }}
          disabled={isPending}
          className="ml-auto"
        >
          {isPending ? 'Publicando...' : 'Publicar Módulo'}
        </Button>
      </div>
    </footer>
  );
};
