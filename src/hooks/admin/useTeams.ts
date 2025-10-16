import { useQuery } from '@tanstack/react-query';
import { getTeams } from '@/api/admin/teams';
import type { TeamListParams } from '@/types/team';

/**
 * Hook to fetch paginated list of teams for a division
 *
 * Features:
 * - Automatic caching (60 seconds)
 * - Refetch on window focus disabled
 * - Error handling built-in
 *
 * @param params - Query parameters (divisionId, limit, offset, search, poolId)
 * @returns TanStack Query result with teams data
 */
export const useTeams = (params: TeamListParams) => {
  return useQuery({
    queryKey: ['teams', params],
    queryFn: () => getTeams(params),
    staleTime: 60000, // 60 seconds
    gcTime: 300000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!params.divisionId, // Only fetch if divisionId provided
  });
};
