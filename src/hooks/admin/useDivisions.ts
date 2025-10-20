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
  console.log('useDivisions called with:', { tournamentId, params, enabled: !!tournamentId });

  const query = useQuery({
    queryKey: ['admin-divisions', tournamentId, params],
    queryFn: () => {
      console.log('useDivisions queryFn executing for tournamentId:', tournamentId);
      return getDivisions(tournamentId!, params);
    },
    enabled: !!tournamentId,
    staleTime: 0, // Admin data should always be fresh
    retry: 1,
    refetchOnWindowFocus: false,
  });

  console.log('useDivisions result:', {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error
  });

  return query;
};
