import { useQuery } from '@tanstack/react-query';
import { getDivision } from '@/api/admin/divisions';

/**
 * Hook to fetch a single division by ID
 *
 * @param id - Division ID
 * @returns Query result with division data
 */
export const useDivision = (id: number) => {
  return useQuery({
    queryKey: ['division', id],
    queryFn: () => getDivision(id),
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 1,
    enabled: !!id && id > 0, // Only fetch if ID is valid
  });
};
