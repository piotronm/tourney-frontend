import { useQuery } from '@tanstack/react-query';
import { getDivisions } from '@/api/admin/divisions';
import type { DivisionListParams } from '@/types/division';

export const useDivisions = (params?: DivisionListParams) => {
  return useQuery({
    queryKey: ['divisions', params],
    queryFn: () => getDivisions(params),
    staleTime: 60000, // 60 seconds
    gcTime: 300000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
