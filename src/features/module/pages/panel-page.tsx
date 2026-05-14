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
import { ModuleCard } from '../components/module-card';
import { ModuleFilter, parsers } from '../components/module-filter';
import { useGetCreatorModules } from '../hooks/api/queries/use-get-creator-modules';
import { useGetSearchStudentModules } from '../hooks/api/queries/use-get-search-student-modules';

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

  const isCreator = user?.role === 'CONTENT_CREATOR';

  // For students
  const studentQuery = useGetSearchStudentModules(
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
    !isCreator,
  );

  // For creators
  const creatorQuery = useGetCreatorModules(
    'published',
    {
      moduleName: debouncedFilters.q,
      grammarRulesId: debouncedFilters.grammarRules,
      levelId: debouncedFilters.levels,
    },
    {
      pageNumber: page - 1,
      pageSize: 10,
    },
    isCreator,
  );

  const { modules, isLoading, isError } = isCreator
    ? creatorQuery
    : studentQuery;

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

      <ModuleFilter isCreator={isCreator} />

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
