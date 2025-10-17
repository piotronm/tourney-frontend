import { useQuery } from '@tanstack/react-query';
import { getPools } from '@/api/admin/pools';

/**
 * Hook to fetch pools for a division
 * Uses TanStack Query for caching and background updates
 *
 * @param divisionId - Division ID to fetch pools for
 * @param options - Query options
 * @param options.isAdmin - If true, uses instant updates (staleTime: 0) for admin operations
 * @returns TanStack Query result with pools data
 */
interface UsePoolsOptions {
  isAdmin?: boolean;
}

export const usePools = (divisionId: number, options?: UsePoolsOptions) => {
  const isAdmin = options?.isAdmin ?? false;

  const queryConfig = {
    staleTime: isAdmin ? 0 : 30000,
    gcTime: isAdmin ? 60000 : 300000,
    refetchOnWindowFocus: isAdmin,
  };

  // Debug logging to verify configuration
  console.log('🔍 usePools config:', {
    divisionId,
    isAdmin,
    staleTime: queryConfig.staleTime,
    refetchOnWindowFocus: queryConfig.refetchOnWindowFocus,
  });

  return useQuery({
    queryKey: ['pools', divisionId],
    queryFn: () => getPools(divisionId),

    // Admin gets instant updates, public gets normal caching
    ...queryConfig,

    enabled: !!divisionId,
  });
};
