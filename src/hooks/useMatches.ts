/**
 * Hook for fetching matches in a division
 * UPDATED: Phase 3 - Now requires tournamentId parameter
 */

import { useQuery } from '@tanstack/react-query';
import { getMatches, type GetMatchesParams } from '@/api/matches';

interface UseMatchesOptions {
  isAdmin?: boolean;
}

export const useMatches = (
  tournamentId: number | undefined,
  divisionId: number | undefined,
  params?: GetMatchesParams,
  options?: UseMatchesOptions
) => {
  const isAdmin = options?.isAdmin ?? false;

  return useQuery({
    queryKey: ['division-matches', tournamentId, divisionId, params],
    queryFn: () => getMatches(tournamentId!, divisionId!, params),
    enabled: !!tournamentId && !!divisionId,
    staleTime: isAdmin ? 0 : 15 * 1000, // Admin: 0ms, Public: 15s
    gcTime: isAdmin ? 60000 : 300000, // Admin: 1 min, Public: 5 min
    refetchOnWindowFocus: isAdmin,
  });
};
