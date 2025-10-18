/**
 * useUpdateDivision Hook
 * Updates an existing division
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDivision } from '@/api/admin/divisions';
import type { UpdateDivisionDto } from '@/types/division';
import { toast } from 'sonner';

interface UpdateDivisionParams {
  tournamentId: number;
  divisionId: number;
  data: UpdateDivisionDto;
}

export const useUpdateDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId, data }: UpdateDivisionParams) =>
      updateDivision(tournamentId, divisionId, data),
    onSuccess: (division, variables) => {
      // Invalidate divisions list for this tournament
      queryClient.invalidateQueries({
        queryKey: ['admin-divisions', variables.tournamentId],
      });
      // Invalidate specific division
      queryClient.invalidateQueries({
        queryKey: ['admin-division', variables.tournamentId, division.id],
      });
      toast.success(`Division "${division.name}" updated successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update division');
    },
  });
};
