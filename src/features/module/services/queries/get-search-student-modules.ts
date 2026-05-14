import { type Module } from '@/@types/module';
import { api } from '@/app/libs/api';

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface GetSearchStudentModules {
  message: string;
  data: Page<Module>;
}

export type ModuleSearchFilters = {
  moduleName?: string;
  grammarRulesId?: string[];
  levelId?: string[];
  status?: string[];
};

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export const getSearchStudentModules = async (
  filters: ModuleSearchFilters,
  pagination: PaginationParams,
): Promise<GetSearchStudentModules> => {
  const formattedStatuses = filters.status?.map((s) => s.toUpperCase());

  const { data } = await api.get('modules/student/search', {
    params: {
      moduleName: filters.moduleName || undefined,
      grammarRulesId: filters.grammarRulesId,
      levelsId: filters.levelId,
      status: formattedStatuses,
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    },
    paramsSerializer: {
      indexes: null,
    },
  });
  return data;
};
