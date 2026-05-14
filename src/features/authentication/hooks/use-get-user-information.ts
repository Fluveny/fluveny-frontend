import { getUserInformation } from '@/features/authentication/services/get-user-information';
import { useQuery } from '@tanstack/react-query';

export const useGetUserInformation = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: getUserInformation,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    retry: false,
  });
};
