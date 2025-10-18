/**
 * useCreateTeam Hook
 * Creates a new team in a division
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeam } from '@/api/admin/teams';
import type { CreateTeamDto } from '@/types/team';
import { toast } from 'sonner';

interface CreateTeamParams {
  tournamentId: number;
  divisionId: number;
  data: CreateTeamDto;
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId, data }: CreateTeamParams) =>
      createTeam(tournamentId, divisionId, data),
    onSuccess: (team, variables) => {
      // Invalidate teams list for this division
      queryClient.invalidateQueries({
        queryKey: ['admin-teams', variables.tournamentId],
      });
      // Invalidate division details (team count changed)
      queryClient.invalidateQueries({
        queryKey: ['admin-division', variables.tournamentId, variables.divisionId],
      });
      toast.success(`Team "${team.name}" created successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create team');
    },
  });
};
