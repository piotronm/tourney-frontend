import { useQuery } from '@tanstack/react-query';
import { getStandings, type GetStandingsParams } from '@/api/standings';

interface UseStandingsOptions {
  isAdmin?: boolean;
}

export const useStandings = (
  divisionId: number | undefined,
  params?: GetStandingsParams,
  options?: UseStandingsOptions
) => {
  const isAdmin = options?.isAdmin ?? false;

  return useQuery({
    queryKey: ['standings', divisionId, params],
    queryFn: () => getStandings(divisionId!, params),
    enabled: !!divisionId,
    staleTime: isAdmin ? 0 : 15 * 1000, // Admin: 0ms, Public: 15s
    gcTime: isAdmin ? 60000 : 300000, // Admin: 1 min, Public: 5 min
    refetchOnWindowFocus: isAdmin,
    // Admin: no auto-refresh (manual control), Public: auto-refresh every 30s
    refetchInterval: isAdmin ? false : 30 * 1000,
  });
};
