/**
 * useDeleteTeam Hook
 * Deletes a team from a division
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTeam } from '@/api/admin/teams';
import { toast } from 'sonner';

interface DeleteTeamParams {
  tournamentId: number;
  divisionId: number;
  teamId: number;
}

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId, teamId }: DeleteTeamParams) =>
      deleteTeam(tournamentId, divisionId, teamId),
    onSuccess: (_, variables) => {
      // Invalidate teams list
      queryClient.invalidateQueries({
        queryKey: ['admin-teams', variables.tournamentId],
      });
      // Invalidate division details (team count changed)
      queryClient.invalidateQueries({
        queryKey: ['admin-division', variables.tournamentId, variables.divisionId],
      });
      toast.success('Team deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete team');
    },
  });
};
