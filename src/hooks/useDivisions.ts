import { useQuery } from '@tanstack/react-query';
import { getDivisions, type GetDivisionsParams } from '@/api/divisions';

interface UseDivisionsOptions {
  isAdmin?: boolean;
}

export const useDivisions = (
  params?: GetDivisionsParams,
  options?: UseDivisionsOptions
) => {
  const isAdmin = options?.isAdmin ?? false;

  return useQuery({
    queryKey: ['divisions', params],
    queryFn: () => getDivisions(params),
    staleTime: isAdmin ? 0 : 60 * 1000, // Admin: 0ms, Public: 1 minute
    gcTime: isAdmin ? 60000 : 300000, // Admin: 1 min, Public: 5 min
    refetchOnWindowFocus: isAdmin,
  });
};
