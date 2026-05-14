import {
  getCreatorModules,
  type CreatorModuleSearchFilters,
  type GetCreatorModulesResponse,
  type PaginationParams,
} from '@/features/module/services/queries/get-creator-modules';
import { useQuery } from '@tanstack/react-query';

export const useGetCreatorModules = (
  status: 'drafts' | 'published',
  filters: CreatorModuleSearchFilters,
  pagination: PaginationParams,
  enabled: boolean = true,
) => {
  const { data, ...rest } = useQuery<GetCreatorModulesResponse>({
    queryKey: ['creator-modules', status, filters, pagination],
    queryFn: () => getCreatorModules(status, filters, pagination),
    enabled,
  });

  return { modules: data?.data, ...rest };
};
