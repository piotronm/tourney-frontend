/**
 * useDivisions Hook
 * Fetches divisions for a specific tournament (admin view)
 */

import { useQuery } from '@tanstack/react-query';
import { getDivisions } from '@/api/admin/divisions';
import type { DivisionListParams } from '@/types/division';

export const useDivisions = (
  tournamentId: number | undefined,
  params?: DivisionListParams
) => {
  return useQuery({
    queryKey: ['admin-divisions', tournamentId, params],
    queryFn: () => getDivisions(tournamentId!, params),
    enabled: !!tournamentId,
    staleTime: 0, // Admin data should always be fresh
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
