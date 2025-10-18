/**
 * useDeleteDivision Hook
 * Deletes a division from a tournament
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDivision } from '@/api/admin/divisions';
import { toast } from 'sonner';

interface DeleteDivisionParams {
  tournamentId: number;
  divisionId: number;
}

export const useDeleteDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId }: DeleteDivisionParams) =>
      deleteDivision(tournamentId, divisionId),
    onSuccess: (_, variables) => {
      // Invalidate divisions list for this tournament
      queryClient.invalidateQueries({
        queryKey: ['admin-divisions', variables.tournamentId],
      });
      // Also invalidate tournament details (stats changed)
      queryClient.invalidateQueries({
        queryKey: ['admin-tournament', variables.tournamentId],
      });
      toast.success('Division deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete division');
    },
  });
};
