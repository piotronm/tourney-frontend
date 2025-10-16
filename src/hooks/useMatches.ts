import { useQuery } from '@tanstack/react-query';
import { getMatches, type GetMatchesParams } from '@/api/matches';

export const useMatches = (divisionId: number | undefined, params?: GetMatchesParams) => {
  return useQuery({
    queryKey: ['matches', divisionId, params],
    queryFn: () => getMatches(divisionId!, params),
    enabled: !!divisionId,
    staleTime: 15 * 1000,
  });
};
