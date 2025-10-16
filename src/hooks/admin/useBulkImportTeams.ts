import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkImportTeams } from '@/api/admin/teams';
import type { BulkImportTeam } from '@/types/team';
import { toast } from 'sonner';

/**
 * Hook to bulk import teams from CSV
 *
 * @returns TanStack Query mutation object
 */
export const useBulkImportTeams = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ divisionId, teams }: { divisionId: number; teams: BulkImportTeam[] }) =>
      bulkImportTeams(divisionId, teams),
    onSuccess: (result, variables) => {
      // Invalidate teams list
      queryClient.invalidateQueries({
        queryKey: ['teams', { divisionId: variables.divisionId }]
      });

      // Show detailed success message
      if (result.errors.length === 0) {
        toast.success(
          `Successfully imported ${result.created} teams!`
        );
      } else {
        toast.warning(
          `Imported ${result.created} teams with ${result.errors.length} errors`
        );
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to import teams');
    },
  });
};
