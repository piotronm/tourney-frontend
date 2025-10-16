import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePool } from '@/api/admin/pools';
import type { UpdatePoolDto } from '@/types/pool';
import { toast } from 'sonner';

/**
 * Hook to update an existing pool
 * Handles cache invalidation and success/error notifications
 *
 * @param divisionId - Division ID (for cache invalidation)
 * @returns TanStack Query mutation object
 */
export const useUpdatePool = (divisionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ poolId, data }: { poolId: number; data: UpdatePoolDto }) =>
      updatePool(poolId, data),
    onSuccess: () => {
      // Invalidate pools list for this division
      queryClient.invalidateQueries({ queryKey: ['pools', divisionId] });
      toast.success('Pool updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update pool');
    },
  });
};
