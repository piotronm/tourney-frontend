/**
 * useUpdateTeam Hook
 * Updates an existing team
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTeam } from '@/api/admin/teams';
import type { UpdateTeamDto } from '@/types/team';
import { toast } from 'sonner';

interface UpdateTeamParams {
  tournamentId: number;
  divisionId: number;
  teamId: number;
  data: UpdateTeamDto;
}

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId, teamId, data }: UpdateTeamParams) =>
      updateTeam(tournamentId, divisionId, teamId, data),
    onSuccess: (team, variables) => {
      // Invalidate teams list
      queryClient.invalidateQueries({
        queryKey: ['admin-teams', variables.tournamentId],
      });
      // Invalidate specific team
      queryClient.invalidateQueries({
        queryKey: ['admin-team', variables.tournamentId, variables.divisionId, team.id],
      });
      // Invalidate pools (team assignments affect pool display)
      queryClient.invalidateQueries({
        queryKey: ['admin-pools', variables.tournamentId, variables.divisionId],
      });
      toast.success(`Team "${team.name}" updated successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update team');
    },
  });
};
