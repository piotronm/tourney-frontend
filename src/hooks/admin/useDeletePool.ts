import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePool } from '@/api/admin/pools';
import { toast } from 'sonner';

/**
 * Hook to delete a pool
 * Handles cache invalidation and success/error notifications
 *
 * @param divisionId - Division ID (for cache invalidation)
 * @returns TanStack Query mutation object
 */
export const useDeletePool = (divisionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (poolId: number) => deletePool(poolId),
    onSuccess: () => {
      // Invalidate pools list for this division
      queryClient.invalidateQueries({ queryKey: ['pools', divisionId] });
      // Invalidate division details (stats may have changed)
      queryClient.invalidateQueries({ queryKey: ['division', divisionId] });
      toast.success('Pool deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete pool');
    },
  });
};
