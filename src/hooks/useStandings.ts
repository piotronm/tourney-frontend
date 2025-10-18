/**
 * Hook for fetching standings in a division
 * UPDATED: Phase 3 - Now requires tournamentId parameter
 */

import { useQuery } from '@tanstack/react-query';
import { getStandings, type GetStandingsParams } from '@/api/standings';

interface UseStandingsOptions {
  isAdmin?: boolean;
}

export const useStandings = (
  tournamentId: number | undefined,
  divisionId: number | undefined,
  params?: GetStandingsParams,
  options?: UseStandingsOptions
) => {
  const isAdmin = options?.isAdmin ?? false;

  return useQuery({
    queryKey: ['division-standings', tournamentId, divisionId, params],
    queryFn: () => getStandings(tournamentId!, divisionId!, params),
    enabled: !!tournamentId && !!divisionId,
    staleTime: isAdmin ? 0 : 15 * 1000, // Admin: 0ms, Public: 15s
    gcTime: isAdmin ? 60000 : 300000, // Admin: 1 min, Public: 5 min
    refetchOnWindowFocus: isAdmin,
    // Admin: no auto-refresh (manual control), Public: auto-refresh every 30s
    refetchInterval: isAdmin ? false : 30 * 1000,
  });
};
