import { useQuery } from '@tanstack/react-query';
import { getTeam } from '@/api/admin/teams';

/**
 * Hook to fetch single team
 *
 * @param divisionId - Division ID
 * @param teamId - Team ID
 * @returns TanStack Query result with team data
 */
export const useTeam = (divisionId: number, teamId: number) => {
  return useQuery({
    queryKey: ['team', divisionId, teamId],
    queryFn: () => getTeam(divisionId, teamId),
    staleTime: 60000,
    gcTime: 300000,
    retry: 1,
    enabled: !!divisionId && !!teamId,
  });
};
