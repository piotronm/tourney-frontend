import { useMutation } from '@tanstack/react-query';
import { exportPlayers } from "@/api/players";
import { toast } from 'sonner';

/**
 * Hook for exporting players to CSV
 *
 * Features:
 * - Downloads all players as CSV file
 * - Includes all fields (email, name, phone, DUPR data, dates)
 * - Success/error toast notifications
 * - Automatic file download
 */
export const useExportPlayers = () => {
  return useMutation({
    mutationFn: exportPlayers,
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `players_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Players exported successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to export players');
    },
  });
};
