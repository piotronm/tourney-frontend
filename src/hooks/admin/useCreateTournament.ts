/**
 * useCreateTournament Hook
 * Creates a new tournament
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTournament, type CreateTournamentDto } from '@/api/admin/tournaments';

export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTournamentDto) => createTournament(data),
    onSuccess: () => {
      // Invalidate tournaments list to refetch with new tournament
      queryClient.invalidateQueries({ queryKey: ['admin-tournaments'] });
    },
  });
};
