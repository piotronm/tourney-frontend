/**
 * useUpdateTournament Hook
 * Updates an existing tournament
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTournament, type UpdateTournamentDto } from '@/api/admin/tournaments';

interface UpdateTournamentParams {
  id: number;
  updates: UpdateTournamentDto;
}

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: UpdateTournamentParams) =>
      updateTournament(id, updates),
    onSuccess: (_, variables) => {
      // Invalidate both tournaments list and specific tournament
      queryClient.invalidateQueries({ queryKey: ['admin-tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-tournament', variables.id] });
    },
  });
};
