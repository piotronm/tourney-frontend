/**
 * useGenerateTeamsFromRegistrations Hook
 * Generates teams from eligible registrations in a division
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateTeamsFromRegistrations, type GenerateTeamsResponse } from '@/api/registrations';
import { toast } from 'sonner';

interface GenerateTeamsParams {
  tournamentId: number;
  divisionId: number;
}

export const useGenerateTeamsFromRegistrations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId }: GenerateTeamsParams) =>
      generateTeamsFromRegistrations(tournamentId, divisionId),
    onSuccess: (result, variables) => {
      // Invalidate registrations to show updated teamId
      queryClient.invalidateQueries({
        queryKey: ['admin-registrations', variables.tournamentId],
      });

      // Invalidate teams to show new teams
      queryClient.invalidateQueries({
        queryKey: ['admin-teams', variables.tournamentId, variables.divisionId],
      });

      // Show success message
      toast.success(
        `✅ Successfully created ${result.created} team${result.created !== 1 ? 's' : ''}!`
      );

      // Show warning if any were skipped
      if (result.skipped > 0) {
        toast.warning(
          `⚠️ Skipped ${result.skipped} registration${result.skipped !== 1 ? 's' : ''}`
        );
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate teams: ${error.message}`);
    },
  });
};
