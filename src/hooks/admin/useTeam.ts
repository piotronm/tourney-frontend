/**
 * useTeam Hook
 * Fetches a single team by ID (admin view)
 */

import { useQuery } from '@tanstack/react-query';
import { getTeam } from '@/api/admin/teams';

export const useTeam = (
  tournamentId: number | undefined,
  divisionId: number | undefined,
  teamId: number | undefined
) => {
  return useQuery({
    queryKey: ['admin-team', tournamentId, divisionId, teamId],
    queryFn: () => getTeam(tournamentId!, divisionId!, teamId!),
    enabled: !!tournamentId && !!divisionId && !!teamId,
    staleTime: 0, // Admin data should always be fresh
  });
};
