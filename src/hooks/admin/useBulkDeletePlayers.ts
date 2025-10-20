import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteBulkPlayers } from '@/api/players';

/**
 * Hook for bulk deleting players
 *
 * Features:
 * - Deletes multiple players at once
 * - Success/error toast notifications
 * - Query invalidation for cache refresh
 * - Error handling for players with registrations
 */
export const useBulkDeletePlayers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBulkPlayers,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });

      const { deleted, failed } = data;

      if (deleted > 0 && failed === 0) {
        toast.success(`${deleted} player${deleted > 1 ? 's' : ''} deleted successfully`);
      } else if (deleted > 0 && failed > 0) {
        toast.warning(`${deleted} deleted, ${failed} failed (have tournament registrations)`);
      } else {
        toast.error('No players could be deleted (all have tournament registrations)');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete players');
    },
  });
};
