/**
 * useGenerateMatches Hook
 * Generates matches for a division
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateMatches } from '@/api/admin/matches';
import type { GenerateMatchesDto } from '@/api/types';
import { toast } from 'sonner';

interface GenerateMatchesParams {
  tournamentId: number;
  divisionId: number;
  data: GenerateMatchesDto;
}

export const useGenerateMatches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId, data }: GenerateMatchesParams) =>
      generateMatches(tournamentId, divisionId, data),
    onSuccess: (result, variables) => {
      // Invalidate matches for this division
      queryClient.invalidateQueries({
        queryKey: ['admin-matches', variables.tournamentId, variables.divisionId],
      });
      // Invalidate division details (match count changed)
      queryClient.invalidateQueries({
        queryKey: ['admin-division', variables.tournamentId, variables.divisionId],
      });
      toast.success(`Generated ${result.count} matches successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate matches');
    },
  });
};
