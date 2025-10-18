import { Card, CardContent, Typography, Alert, Button, Box, Skeleton } from '@mui/material';
import { Warning, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDivisions } from '@/hooks/admin/useDivisions';

interface PendingAction {
  type: 'warning' | 'info';
  title: string;
  count: number;
  link: string;
}

export function PendingActionsWidget() {
  const navigate = useNavigate();
  const { data, isLoading } = useDivisions({ limit: 100 });

  if (isLoading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  const divisions = data?.data || [];

  // Calculate pending actions
  const pendingActions: PendingAction[] = [];

  // Matches awaiting scores
  const matchesAwaitingScores = divisions.reduce((sum, d) => {
    const pending = (d.stats?.matches || 0) - (d.stats?.completedMatches || 0);
    return sum + pending;
  }, 0);

  if (matchesAwaitingScores > 0) {
    pendingActions.push({
      type: 'warning',
      title: `${matchesAwaitingScores} match${matchesAwaitingScores !== 1 ? 'es' : ''} awaiting scores`,
      count: matchesAwaitingScores,
      link: '/admin/divisions',
    });
  }

  // Divisions with no matches yet
  const divisionsNeedingMatches = divisions.filter(d =>
    (d.stats?.teams || 0) > 0 && (d.stats?.matches || 0) === 0
  ).length;

  if (divisionsNeedingMatches > 0) {
    pendingActions.push({
      type: 'info',
      title: `${divisionsNeedingMatches} division${divisionsNeedingMatches !== 1 ? 's' : ''} ready to generate matches`,
      count: divisionsNeedingMatches,
      link: '/admin/divisions',
    });
  }

  // Divisions with no teams
  const divisionsNeedingTeams = divisions.filter(d => (d.stats?.teams || 0) === 0).length;

  if (divisionsNeedingTeams > 0) {
    pendingActions.push({
      type: 'info',
      title: `${divisionsNeedingTeams} division${divisionsNeedingTeams !== 1 ? 's' : ''} need${divisionsNeedingTeams === 1 ? 's' : ''} teams`,
      count: divisionsNeedingTeams,
      link: '/admin/divisions',
    });
  }

  if (pendingActions.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Warning color="action" />
            <Typography variant="h6">Pending Actions</Typography>
          </Box>
          <Alert severity="success">
            All caught up! No pending actions. ✅
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Warning color="warning" />
          <Typography variant="h6">Pending Actions</Typography>
        </Box>

        {pendingActions.map((action, index) => (
          <Alert
            key={index}
            severity={action.type === 'warning' ? 'warning' : 'info'}
            action={
              <Button
                size="small"
                onClick={() => navigate(action.link)}
              >
                View
              </Button>
            }
            sx={{ mb: index < pendingActions.length - 1 ? 1 : 0 }}
          >
            {action.title}
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
