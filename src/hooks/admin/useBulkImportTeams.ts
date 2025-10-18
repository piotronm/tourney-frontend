/**
 * useBulkImportTeams Hook
 * Bulk imports teams from CSV data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkImportTeams } from '@/api/admin/teams';
import type { BulkImportTeam } from '@/types/team';
import { toast } from 'sonner';

interface BulkImportParams {
  tournamentId: number;
  divisionId: number;
  teams: BulkImportTeam[];
}

export const useBulkImportTeams = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tournamentId, divisionId, teams }: BulkImportParams) =>
      bulkImportTeams(tournamentId, divisionId, teams),
    onSuccess: (result, variables) => {
      // Invalidate teams list
      queryClient.invalidateQueries({
        queryKey: ['admin-teams', variables.tournamentId],
      });
      // Invalidate division details (team count changed)
      queryClient.invalidateQueries({
        queryKey: ['admin-division', variables.tournamentId, variables.divisionId],
      });
      
      const { created, errors } = result;
      if (errors.length > 0) {
        toast.warning(`Imported ${created} teams with ${errors.length} errors`);
      } else {
        toast.success(`Successfully imported ${created} teams!`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to import teams');
    },
  });
};
