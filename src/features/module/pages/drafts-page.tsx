import { ROUTES } from '@/app/configs/routes';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { LoadingScreen } from '@/templates/loading-screen';
import { NotFound } from '@/templates/not-found';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ModuleCard } from '../components/module-card';
import { ModuleFilter, parsers } from '../components/module-filter';
import { useGetCreatorModules } from '../hooks/api/queries/use-get-creator-modules';

export const DraftsPage = () => {
  const [query, setQuery] = useQueryStates({
    ...parsers,
    page: parseAsInteger.withDefault(1),
  });
  const { page, ...filters } = query;
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [filters]);

  const { modules, isLoading, isError } = useGetCreatorModules(
    'drafts',
    {
      moduleName: debouncedFilters.q,
      grammarRulesId: debouncedFilters.grammarRules,
      levelId: debouncedFilters.levels,
    },
    {
      pageNumber: page - 1,
      pageSize: 10,
    },
  );

  const handlePageChange = (newPage: number) => {
    if (!modules) return;

    if (newPage < 1 || newPage > modules.totalPages) {
      return;
    }
    setQuery({ page: newPage });
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    if (isError) {
      return <NotFound />;
    }

    if (!modules || modules.content.length === 0) {
      return (
        <div className="flex w-full justify-center text-lg">
          Nenhum rascunho encontrado.
        </div>
      );
    }

    return (
      <ul className="grid grid-rows-4 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:gap-6">
        {modules.content.map((module) => (
          <ModuleCard key={module.id} {...module} isDraft />
        ))}
      </ul>
    );
  };

  return (
    <div className="relative flex flex-col space-y-4 p-4 lg:space-y-5">
      <h1 className="mt-2 text-center text-3xl font-bold tracking-widest lg:mt-8 lg:text-4xl">
        Rascunhos
      </h1>

      <Button
        className="text-md ml-auto h-10 rounded-md px-6 font-normal lg:py-6 lg:text-lg"
        asChild
      >
        <Link to={`${ROUTES.modules}/${ROUTES.create}`}>Criar Módulo</Link>
      </Button>

      <ModuleFilter isCreator />

      {renderContent()}

      {!isLoading && !isError && modules && modules.totalPages > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page - 1);
                }}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="px-4 text-sm">
                Página {page} de {modules.totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page + 1);
                }}
                className={
                  page === modules.totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
