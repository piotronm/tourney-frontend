/**
 * useTeams Hook
 * Fetches teams for a specific division (admin view)
 */

import { useQuery } from '@tanstack/react-query';
import { getTeams } from '@/api/admin/teams';
import type { TeamListParams } from '@/types/team';

export const useTeams = (
  tournamentId: number | undefined,
  params: TeamListParams
) => {
  return useQuery({
    queryKey: ['admin-teams', tournamentId, params],
    queryFn: () => getTeams(tournamentId!, params),
    enabled: !!tournamentId && !!params.divisionId,
    staleTime: 0, // Admin data should always be fresh
  });
};
