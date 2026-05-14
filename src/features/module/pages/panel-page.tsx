import { ROUTES } from '@/app/configs/routes';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { LoadingScreen } from '@/templates/loading-screen';
import { NotFound } from '@/templates/not-found';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ModuleCard } from '../components/module-card';
import { ModuleFilter, parsers } from '../components/module-filter';
import { useGetSearchStudentModules } from '../hooks/api/queries/use-get-search-student-modules';

const permittedRoles = ['ADMIN', 'CONTENT_CREATOR'];

export const PanelPage = () => {
  const { user } = useAuthStore();

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

  const { modules, isLoading, isError } = useGetSearchStudentModules(
    {
      moduleName: debouncedFilters.q,
      grammarRulesId: debouncedFilters.grammarRules,
      levelId: debouncedFilters.levels,
      status: debouncedFilters.statuses,
    },
    {
      pageNumber: page - 1,
      pageSize: 10,
    },
  );

  const canViewDrafts = user && permittedRoles.includes(user.role);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    if (isError) {
      return <NotFound />;
    }

    if (!modules || modules.size === 0) {
      return (
        <div className="flex w-full justify-center text-lg">
          Nenhum módulo encontrado com os filtros aplicados.
        </div>
      );
    }

    return (
      <ul className="grid grid-rows-4 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:gap-6">
        {modules.content.map((module) => (
          <ModuleCard key={module.id} {...module} isDraft={false} />
        ))}
      </ul>
    );
  };

  const handlePageChange = (newPage: number) => {
    if (!modules) return;

    if (newPage < 1 || newPage > modules.totalPages) {
      return;
    }
    setQuery({ page: newPage });
  };

  return (
    <div className="flex flex-col space-y-4 p-4 lg:space-y-5">
      <h1 className="mt-2 text-center text-3xl font-bold tracking-widest lg:mt-8 lg:text-4xl">
        Módulos
      </h1>
      {canViewDrafts && (
        <Button
          className="text-md ml-auto h-10 rounded-md px-6 font-normal lg:py-6 lg:text-lg"
          asChild
        >
          <Link to={`${ROUTES.drafts}`}>Rascunhos</Link>
        </Button>
      )}

      <ModuleFilter />

      {renderContent()}

      {!isLoading && !isError && modules && (
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
