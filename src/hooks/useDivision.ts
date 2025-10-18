/**
 * Hook for fetching a single division with details
 * UPDATED: Phase 3 - Now requires tournamentId parameter
 */

import { useQuery } from '@tanstack/react-query';
import { getDivision } from '@/api/divisions';

interface UseDivisionOptions {
  isAdmin?: boolean;
}

export const useDivision = (
  tournamentId: number | undefined,
  divisionId: number | undefined,
  options?: UseDivisionOptions
) => {
  const isAdmin = options?.isAdmin ?? false;

  return useQuery({
    queryKey: ['division', tournamentId, divisionId],
    queryFn: () => getDivision(tournamentId!, divisionId!),
    enabled: !!tournamentId && !!divisionId,
    staleTime: isAdmin ? 0 : 30 * 1000, // Admin: 0ms, Public: 30s
    gcTime: isAdmin ? 60000 : 300000, // Admin: 1 min, Public: 5 min
    refetchOnWindowFocus: isAdmin,
  });
};
