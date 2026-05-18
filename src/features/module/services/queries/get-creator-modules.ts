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

export interface GetCreatorModulesResponse {
  message: string;
  data: Page<Module>;
}

export type CreatorModuleSearchFilters = {
  moduleName?: string;
  grammarRulesId?: string[];
  levelId?: string[];
};

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export const getCreatorModules = async (
  status: 'drafts' | 'published',
  filters: CreatorModuleSearchFilters,
  pagination: PaginationParams,
): Promise<GetCreatorModulesResponse> => {
  const { data } = await api.get(`/modules/author/${status}/search`, {
    params: {
      moduleName: filters.moduleName || undefined,
      grammarRulesId: filters.grammarRulesId,
      levelsId: filters.levelId,
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    },
    paramsSerializer: {
      indexes: null,
    },
  });
  return data;
};
