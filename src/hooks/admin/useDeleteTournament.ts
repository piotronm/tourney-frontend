/**
 * useDeleteTournament Hook
 * Deletes a tournament
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTournament } from '@/api/admin/tournaments';

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tournamentId: number) => deleteTournament(tournamentId),
    onSuccess: () => {
      // Invalidate tournaments list
      queryClient.invalidateQueries({ queryKey: ['admin-tournaments'] });
      // Also invalidate all tournament-related data since tournament is deleted
      queryClient.invalidateQueries({ queryKey: ['admin-divisions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
    },
  });
};
