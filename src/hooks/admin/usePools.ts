import { useQuery } from '@tanstack/react-query';
import { getPools } from '@/api/admin/pools';

/**
 * Hook to fetch pools for a division
 * Uses TanStack Query for caching and background updates
 *
 * @param divisionId - Division ID to fetch pools for
 * @returns TanStack Query result with pools data
 */
export const usePools = (divisionId: number) => {
  return useQuery({
    queryKey: ['pools', divisionId],
    queryFn: () => getPools(divisionId),
    staleTime: 30000, // 30 seconds
    enabled: !!divisionId,
  });
};
