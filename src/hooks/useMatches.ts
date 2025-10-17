import { useQuery } from '@tanstack/react-query';
import { getMatches, type GetMatchesParams } from '@/api/matches';

interface UseMatchesOptions {
  isAdmin?: boolean;
}

export const useMatches = (
  divisionId: number | undefined,
  params?: GetMatchesParams,
  options?: UseMatchesOptions
) => {
  const isAdmin = options?.isAdmin ?? false;

  return useQuery({
    queryKey: ['matches', divisionId, params],
    queryFn: () => getMatches(divisionId!, params),
    enabled: !!divisionId,
    staleTime: isAdmin ? 0 : 15 * 1000, // Admin: 0ms, Public: 15s
    gcTime: isAdmin ? 60000 : 300000, // Admin: 1 min, Public: 5 min
    refetchOnWindowFocus: isAdmin,
  });
};
