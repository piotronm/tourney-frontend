import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeam } from '@/api/admin/teams';
import type { CreateTeamDto } from '@/types/team';
import { toast } from 'sonner';

/**
 * Hook to create new team
 *
 * Features:
 * - Invalidates teams query on success
 * - Shows success/error toast notifications
 * - Returns mutation object with loading/error states
 *
 * @returns TanStack Query mutation object
 */
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ divisionId, data }: { divisionId: number; data: CreateTeamDto }) =>
      createTeam(divisionId, data),
    onSuccess: (team, variables) => {
      // Invalidate teams list to trigger refetch
      queryClient.invalidateQueries({
        queryKey: ['teams', { divisionId: variables.divisionId }]
      });

      // Show success message
      toast.success(`Team "${team.name}" created successfully!`);
    },
    onError: (error: Error) => {
      // Show error message
      toast.error(error.message || 'Failed to create team');
    },
  });
};
