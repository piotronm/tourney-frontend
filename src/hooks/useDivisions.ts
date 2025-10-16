import { useQuery } from '@tanstack/react-query';
import { getDivisions, type GetDivisionsParams } from '@/api/divisions';

export const useDivisions = (params?: GetDivisionsParams) => {
  return useQuery({
    queryKey: ['divisions', params],
    queryFn: () => getDivisions(params),
    staleTime: 60 * 1000, // 1 minute
  });
};
