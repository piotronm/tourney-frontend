import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
// NOTE: These API functions need to be created in src/api/divisions.ts
// import { createDivision, updateDivision, deleteDivision } from '@/api/divisions';

/**
 * Mutation hook for creating a new division
 *
 * Invalidates: ['divisions']
 */
export function useCreateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      // TODO: Implement createDivision API function
      // return createDivision(data);
      console.log('useCreateDivision called with:', data);
      throw new Error('API function not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      toast.success('Division created successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to create division:', error);
      toast.error(error.message || 'Failed to create division');
    },
  });
}

/**
 * Mutation hook for updating a division
 *
 * Invalidates: ['divisions'], ['division', id]
 */
export function useUpdateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; name: string }) => {
      // TODO: Implement updateDivision API function
      // return updateDivision(data.id, { name: data.name });
      console.log('useUpdateDivision called with:', data);
      throw new Error('API function not yet implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      queryClient.invalidateQueries({
        queryKey: ['division', variables.id],
      });
      toast.success('Division updated successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to update division:', error);
      toast.error(error.message || 'Failed to update division');
    },
  });
}

/**
 * Mutation hook for deleting a division
 *
 * Invalidates: ['divisions']
 */
export function useDeleteDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // TODO: Implement deleteDivision API function
      // return deleteDivision(id);
      console.log('useDeleteDivision called with:', id);
      throw new Error('API function not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      toast.success('Division deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to delete division:', error);
      toast.error(error.message || 'Failed to delete division');
    },
  });
}
