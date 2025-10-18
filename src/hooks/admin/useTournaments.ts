/**
 * useTournaments Hook
 * Fetches list of all tournaments (admin view)
 */

import { useQuery } from '@tanstack/react-query';
import { getTournaments } from '@/api/admin/tournaments';

export const useTournaments = () => {
  return useQuery({
    queryKey: ['admin-tournaments'],
    queryFn: getTournaments,
    staleTime: 0, // Admin data should always be fresh
  });
};
