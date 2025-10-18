/**
 * useBulkCreatePools Hook
 * Bulk creates multiple pools in a division
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkCreatePools } from '@/api/admin/pools';
import type { CreatePoolDto } from '@/types/pool';
import { toast } from 'sonner';

interface BulkCreatePoolsParams {
  tournamentId: number;
  divisionId: number;
  pools: CreatePoolDto[];
}

export const useBulkCreatePools = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId, pools }: BulkCreatePoolsParams) =>
      bulkCreatePools(tournamentId, divisionId, pools),
    onSuccess: (result, variables) => {
      // Invalidate pools for this division
      queryClient.invalidateQueries({
        queryKey: ['admin-pools', variables.tournamentId, variables.divisionId],
      });
      // Invalidate division details (pool count changed)
      queryClient.invalidateQueries({
        queryKey: ['admin-division', variables.tournamentId, variables.divisionId],
      });
      toast.success(result.message || `Created ${result.pools.length} pools successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create pools');
    },
  });
};
