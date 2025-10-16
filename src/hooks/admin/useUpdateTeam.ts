import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTeam } from '@/api/admin/teams';
import type { UpdateTeamDto } from '@/types/team';
import { toast } from 'sonner';

/**
 * Hook to update existing team
 *
 * @returns TanStack Query mutation object
 */
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      divisionId,
      teamId,
      data,
    }: {
      divisionId: number;
      teamId: number;
      data: UpdateTeamDto;
    }) => updateTeam(divisionId, teamId, data),
    onSuccess: (team, variables) => {
      // Invalidate both list and single team queries
      queryClient.invalidateQueries({
        queryKey: ['teams', { divisionId: variables.divisionId }]
      });
      queryClient.invalidateQueries({
        queryKey: ['team', variables.divisionId, variables.teamId]
      });

      toast.success(`Team "${team.name}" updated successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update team');
    },
  });
};
