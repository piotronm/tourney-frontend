import { useQuery } from '@tanstack/react-query';
import { getDivision } from '@/api/divisions';

export const useDivision = (id: number | undefined) => {
  return useQuery({
    queryKey: ['division', id],
    queryFn: () => getDivision(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};
