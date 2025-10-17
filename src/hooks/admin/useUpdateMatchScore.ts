import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMatchScore } from '@/api/admin/matches';
import type { UpdateMatchScoreRequest } from '@/api/types';
import { toast } from 'sonner';

/**
 * Hook to update match score (Phase 6)
 *
 * Invalidates:
 * - matches query (to refresh match list)
 * - standings query (to refresh team stats)
 * - division query (to update match completion count)
 *
 * @param matchId - The ID of the match to update
 * @param divisionId - The ID of the division (for query invalidation)
 * @returns TanStack Query mutation object
 */
export const useUpdateMatchScore = ({
  matchId,
  divisionId,
}: {
  matchId: number;
  divisionId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMatchScoreRequest) => updateMatchScore(matchId, data),
    onSuccess: (response) => {
      const { match } = response;

      // Invalidate matches query to refresh match list
      queryClient.invalidateQueries({
        queryKey: ['matches', divisionId]
      });

      // Invalidate standings query to refresh team stats
      queryClient.invalidateQueries({
        queryKey: ['standings', divisionId]
      });

      // Invalidate division query to update match completion stats
      queryClient.invalidateQueries({
        queryKey: ['division', divisionId]
      });

      // Show success toast
      if (match.status === 'completed') {
        toast.success('Match score updated and standings recalculated!');
      } else {
        toast.success(`Match status updated to "${match.status}"`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update match score');
    },
  });
};
