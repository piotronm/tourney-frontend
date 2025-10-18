import { Chip } from '@mui/material';

export type TournamentStatus = 'setup' | 'ready' | 'in_progress' | 'completed';

interface StatusBadgeProps {
  status: TournamentStatus;
  size?: 'small' | 'medium';
}

export function getStatusLabel(status: TournamentStatus): string {
  switch (status) {
    case 'setup': return 'Setup';
    case 'ready': return 'Ready';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
  }
}

export function getStatusColor(status: TournamentStatus): 'default' | 'primary' | 'warning' | 'success' {
  switch (status) {
    case 'setup': return 'default';
    case 'ready': return 'primary';
    case 'in_progress': return 'warning';
    case 'completed': return 'success';
  }
}

export function getTournamentStatus(division: any): TournamentStatus {
  const teams = division.stats?.teams || 0;
  const matches = division.stats?.matches || 0;
  const completed = division.stats?.completedMatches || 0;

  if (teams === 0) return 'setup';
  if (matches === 0) return 'ready';
  if (completed === matches && matches > 0) return 'completed';
  return 'in_progress';
}

export function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
  return (
    <Chip
      label={getStatusLabel(status)}
      size={size}
      color={getStatusColor(status)}
      variant="outlined"
    />
  );
}
