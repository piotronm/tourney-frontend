/**
 * Hook for fetching all active tournaments
 * Phase 3: Tournament hierarchy support
 */

import { useQuery } from '@tanstack/react-query';
import { getTournaments } from '@/api/tournaments';

export const useTournaments = () => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: getTournaments,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
