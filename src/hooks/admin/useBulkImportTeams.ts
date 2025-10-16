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

      // Log full result for debugging
      console.log('Bulk import result:', result);

      // Show detailed success message
      if (result.errors.length === 0) {
        toast.success(
          `Successfully imported ${result.created} teams!`
        );
      } else {
        // Show detailed error information
        console.error('Import errors:', result.errors);

        // Show first few errors in toast
        const errorSummary = result.errors.slice(0, 3).map(e =>
          `Row ${e.row}: ${e.message}`
        ).join('\n');

        const moreErrors = result.errors.length > 3
          ? `\n... and ${result.errors.length - 3} more errors`
          : '';

        if (result.created === 0) {
          toast.error(
            `Failed to import any teams.\n${errorSummary}${moreErrors}`,
            { duration: 8000 }
          );
        } else {
          toast.warning(
            `Imported ${result.created} teams with ${result.errors.length} errors.\n${errorSummary}${moreErrors}`,
            { duration: 6000 }
          );
        }
      }
    },
    onError: (error: Error) => {
      console.error('Bulk import error:', error);
      toast.error(error.message || 'Failed to import teams');
    },
  });
};
