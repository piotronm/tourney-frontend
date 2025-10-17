import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bulkCreatePools } from '@/api/admin/pools';
import type { CreatePoolDto } from '@/types/pool';

export const useBulkCreatePools = (divisionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (count: number) => {
      // Generate pool names: A, B, C, D, ...
      const pools: CreatePoolDto[] = Array.from({ length: count }, (_, i) => ({
        name: `Pool ${String.fromCharCode(65 + i)}`,
        label: String.fromCharCode(65 + i),
        orderIndex: i + 1,
      }));

      return bulkCreatePools(divisionId, pools);
    },
    onSuccess: (_, count) => {
      queryClient.invalidateQueries({ queryKey: ['pools', divisionId] });
      queryClient.invalidateQueries({ queryKey: ['division', divisionId] });
      toast.success(`Created ${count} pools successfully!`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create pools';
      toast.error(message);
    },
  });
};
