/**
 * useTournament Hook
 * Fetches single tournament details (admin view)
 */

import { useQuery } from '@tanstack/react-query';
import { getTournament } from '@/api/admin/tournaments';

export const useTournament = (tournamentId: number | undefined) => {
  return useQuery({
    queryKey: ['admin-tournament', tournamentId],
    queryFn: () => getTournament(tournamentId!),
    enabled: !!tournamentId,
    staleTime: 0, // Admin data should always be fresh
  });
};
