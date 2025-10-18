/**
 * useCreatePool Hook
 * Creates a new pool in a division
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPool } from '@/api/admin/pools';
import type { CreatePoolDto } from '@/types/pool';
import { toast } from 'sonner';

interface CreatePoolParams {
  tournamentId: number;
  divisionId: number;
  data: CreatePoolDto;
}

export const useCreatePool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId, data }: CreatePoolParams) =>
      createPool(tournamentId, divisionId, data),
    onSuccess: (pool, variables) => {
      // Invalidate pools for this division
      queryClient.invalidateQueries({
        queryKey: ['admin-pools', variables.tournamentId, variables.divisionId],
      });
      // Invalidate division details (pool count changed)
      queryClient.invalidateQueries({
        queryKey: ['admin-division', variables.tournamentId, variables.divisionId],
      });
      toast.success(`Pool "${pool.name}" created successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create pool');
    },
  });
};
