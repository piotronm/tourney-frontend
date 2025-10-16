import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTeam } from '@/api/admin/teams';
import { toast } from 'sonner';

/**
 * Hook to delete team
 *
 * @returns TanStack Query mutation object
 */
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ divisionId, teamId }: { divisionId: number; teamId: number }) =>
      deleteTeam(divisionId, teamId),
    onSuccess: (_, variables) => {
      // Invalidate teams list
      queryClient.invalidateQueries({
        queryKey: ['teams', { divisionId: variables.divisionId }]
      });

      toast.success('Team deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete team');
    },
  });
};
