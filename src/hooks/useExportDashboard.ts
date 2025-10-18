import { useCallback } from 'react';
import { exportToCsv } from '@/utils/exportToCsv';
import type { Division } from '@/types/division';
import { getTournamentStatus, getStatusLabel } from '@/components/ui/StatusBadge';

export function useExportDashboard() {
  const exportDashboard = useCallback((divisions: Division[]) => {
    const exportData = divisions.map(division => {
      const status = getTournamentStatus(division);
      return {
        name: division.name,
        description: division.description || '',
        status: getStatusLabel(status),
        teams: division.stats?.teams || 0,
        pools: division.stats?.pools || 0,
        matches: division.stats?.matches || 0,
        completedMatches: division.stats?.completedMatches || 0,
        createdAt: division.createdAt ? new Date(division.createdAt).toLocaleDateString() : '',
      };
    });

    const headers = [
      { key: 'name' as const, label: 'Division Name' },
      { key: 'description' as const, label: 'Description' },
      { key: 'status' as const, label: 'Status' },
      { key: 'teams' as const, label: 'Teams' },
      { key: 'pools' as const, label: 'Pools' },
      { key: 'matches' as const, label: 'Total Matches' },
      { key: 'completedMatches' as const, label: 'Completed Matches' },
      { key: 'createdAt' as const, label: 'Created Date' },
    ];

    const filename = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCsv(exportData, headers, filename);
  }, []);

  return { exportDashboard };
}
