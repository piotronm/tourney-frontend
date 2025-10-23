/**
 * useDistributeTeams Hook
 * Distributes unassigned teams to pools automatically
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { distributeTeams, type DistributeTeamsResponse } from '@/api/admin/pools';
import { toast } from 'sonner';

interface DistributeTeamsParams {
  tournamentId: number;
  divisionId: number;
  strategy: 'balanced' | 'random';
}

export const useDistributeTeams = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId, strategy }: DistributeTeamsParams) =>
      distributeTeams(tournamentId, divisionId, strategy),
    onSuccess: (result, variables) => {
      // Invalidate teams query to show updated pool assignments
      queryClient.invalidateQueries({
        queryKey: ['admin-teams', variables.tournamentId, variables.divisionId],
      });

      // Invalidate pools query to show updated team counts
      queryClient.invalidateQueries({
        queryKey: ['admin-pools', variables.tournamentId, variables.divisionId],
      });

      // Show success message
      const poolCount = result.distribution.length;
      toast.success(
        `✅ Distributed ${result.distributed} team${result.distributed !== 1 ? 's' : ''} across ${poolCount} pool${poolCount !== 1 ? 's' : ''}!`
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to distribute teams: ${error.message}`);
    },
  });
};
