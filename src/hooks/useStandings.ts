import { useQuery } from '@tanstack/react-query';
import { getStandings, type GetStandingsParams } from '@/api/standings';

export const useStandings = (divisionId: number | undefined, params?: GetStandingsParams) => {
  return useQuery({
    queryKey: ['standings', divisionId, params],
    queryFn: () => getStandings(divisionId!, params),
    enabled: !!divisionId,
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000, // Auto-refresh every 30s
  });
};
