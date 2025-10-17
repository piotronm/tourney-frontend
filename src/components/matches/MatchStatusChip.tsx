import { Chip } from '@mui/material';
import type { MatchStatus } from '@/api/types';

interface MatchStatusChipProps {
  status: MatchStatus;
}

export function MatchStatusChip({ status }: MatchStatusChipProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return { label: 'Final', color: 'success' as const, icon: '✅' };
      case 'in_progress':
        return { label: 'In Progress', color: 'warning' as const, icon: '⏳' };
      case 'pending':
        return { label: 'Scheduled', color: 'default' as const, icon: '📅' };
      case 'walkover':
        return { label: 'Walkover', color: 'info' as const, icon: '🚶' };
      case 'forfeit':
        return { label: 'Forfeit', color: 'error' as const, icon: '🏳️' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'error' as const, icon: '❌' };
      default:
        return { label: 'Unknown', color: 'default' as const, icon: '❓' };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={`${config.icon} ${config.label}`}
      color={config.color}
      size="small"
      sx={{ fontWeight: 'medium' }}
    />
  );
}
