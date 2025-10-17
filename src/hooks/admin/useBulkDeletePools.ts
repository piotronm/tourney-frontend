import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deletePool } from '@/api/admin/pools';

/**
 * Hook to bulk delete multiple pools
 * Deletes pools in parallel for better performance
 *
 * @param divisionId - Division ID containing the pools
 * @returns TanStack Query mutation object
 */
export const useBulkDeletePools = (divisionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (poolIds: number[]) => {
      // Delete in parallel for speed
      const results = await Promise.allSettled(
        poolIds.map((id) => deletePool(id))
      );

      const failed = results.filter(r => r.status === 'rejected');

      if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} pool(s)`);
      }

      return results;
    },
    onSuccess: (_, poolIds) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['pools', divisionId] });
      queryClient.invalidateQueries({ queryKey: ['division', divisionId] });
      queryClient.invalidateQueries({ queryKey: ['teams', divisionId] });

      toast.success(`Deleted ${poolIds.length} pool(s) successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete some pools');
    },
  });
};
