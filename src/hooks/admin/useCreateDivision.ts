/**
 * useCreateDivision Hook
 * Creates a new division in a tournament
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDivision } from '@/api/admin/divisions';
import type { CreateDivisionDto } from '@/types/division';
import { toast } from 'sonner';

interface CreateDivisionParams {
  tournamentId: number;
  data: CreateDivisionDto;
}

export const useCreateDivision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, data }: CreateDivisionParams) =>
      createDivision(tournamentId, data),
    onSuccess: (division, variables) => {
      // Invalidate divisions list for this tournament
      queryClient.invalidateQueries({
        queryKey: ['admin-divisions', variables.tournamentId],
      });
      // Also invalidate tournament details (stats changed)
      queryClient.invalidateQueries({
        queryKey: ['admin-tournament', variables.tournamentId],
      });
      toast.success(`Division "${division.name}" created successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create division');
    },
  });
};
