/**
 * useDivision Hook
 * Fetches a single division by ID (admin view)
 *
 * @param tournamentId - Tournament ID
 * @param divisionId - Division ID
 * @returns Query result with division data
 */

import { useQuery } from '@tanstack/react-query';
import { getDivision } from '@/api/admin/divisions';

export const useDivision = (
  tournamentId: number | undefined,
  divisionId: number | undefined
) => {
  return useQuery({
    queryKey: ['admin-division', tournamentId, divisionId],
    queryFn: () => getDivision(tournamentId!, divisionId!),
    enabled: !!tournamentId && !!divisionId && divisionId > 0,
    staleTime: 0, // Admin data should always be fresh
    retry: 1,
  });
};
