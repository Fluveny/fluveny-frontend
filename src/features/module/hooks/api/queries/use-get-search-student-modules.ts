import {
  getSearchStudentModules,
  type GetSearchStudentModules,
  type ModuleSearchFilters,
  type PaginationParams,
} from '@/features/module/services/queries/get-search-student-modules';
import { useQuery } from '@tanstack/react-query';

export const useGetSearchStudentModules = (
  filters: ModuleSearchFilters,
  pagination: PaginationParams,
) => {
  const { data, ...rest } = useQuery<GetSearchStudentModules>({
    queryKey: ['student-modules', filters, pagination],
    queryFn: () => getSearchStudentModules(filters, pagination),
  });

  return { modules: data?.data, ...rest };
};
