import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMatch } from '@/api/admin/matches';
import { toast } from 'sonner';

/**
 * Hook to delete a match
 * Handles cache invalidation and success/error notifications
 *
 * @returns TanStack Query mutation object
 */
export const useDeleteMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => deleteMatch(matchId.toString()),
    onSuccess: () => {
      // Invalidate all match-related queries
      queryClient.invalidateQueries({ queryKey: ['division-matches'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] });
      toast.success('Match deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete match');
    },
  });
};
