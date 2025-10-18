/**
 * Hook for fetching a single tournament with details
 * Phase 3: Tournament hierarchy support
 */

import { useQuery } from '@tanstack/react-query';
import { getTournament } from '@/api/tournaments';

export const useTournament = (id: number | undefined) => {
  return useQuery({
    queryKey: ['tournament', id],
    queryFn: () => getTournament(id!),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
