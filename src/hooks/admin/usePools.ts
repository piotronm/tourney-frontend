/**
 * usePools Hook
 * Fetches pools for a specific division (admin view)
 */

import { useQuery } from '@tanstack/react-query';
import { getPools } from '@/api/admin/pools';

export const usePools = (
  tournamentId: number | undefined,
  divisionId: number | undefined
) => {
  return useQuery({
    queryKey: ['admin-pools', tournamentId, divisionId],
    queryFn: () => getPools(tournamentId!, divisionId!),
    enabled: !!tournamentId && !!divisionId,
    staleTime: 0, // Admin data should always be fresh
  });
};
