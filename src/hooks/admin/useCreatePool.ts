import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPool } from '@/api/admin/pools';
import type { CreatePoolDto } from '@/types/pool';
import { toast } from 'sonner';

/**
 * Hook to create a new pool in a division
 * Handles cache invalidation and success/error notifications
 *
 * @param divisionId - Division ID to create pool in
 * @returns TanStack Query mutation object
 */
export const useCreatePool = (divisionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePoolDto) => createPool(divisionId, data),
    onSuccess: () => {
      // Invalidate pools list for this division
      queryClient.invalidateQueries({ queryKey: ['pools', divisionId] });
      // Invalidate division details (stats may have changed)
      queryClient.invalidateQueries({ queryKey: ['division', divisionId] });
      toast.success('Pool created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create pool');
    },
  });
};
