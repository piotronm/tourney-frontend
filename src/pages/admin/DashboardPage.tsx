import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  EmojiEvents,
  Groups,
  SportsTennis,
  CheckCircle,
  FileDownload,
} from '@mui/icons-material';
import { useDivisions } from '@/hooks/admin/useDivisions';
import { useExportDashboard } from '@/hooks/useExportDashboard';
import { PendingActionsWidget } from '@/components/admin/PendingActionsWidget';
import { QuickActionsGrid } from '@/components/admin/QuickActionsGrid';
import { RecentActivityFeed } from '@/components/admin/RecentActivityFeed';
import { EnhancedEmptyState } from '@/components/ui/EnhancedEmptyState';

/**
 * Admin Dashboard Page
 * Shows overview statistics and quick actions
 *
 * Features:
 * - Real-time division statistics
 * - Quick create division button
 * - Navigate to manage divisions
 * - Loading and error states
 */
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { exportDashboard } = useExportDashboard();

  // Fetch all divisions to calculate stats (max 100 due to backend limit)
  const { data, isLoading, isError } = useDivisions({ limit: 100 });

  const handleCreateDivision = () => {
    navigate('/admin/divisions/new');
  };

  const handleManageDivisions = () => {
    navigate('/admin/divisions');
  };

  const handleExport = () => {
    const divisions = data?.data || [];
    exportDashboard(divisions);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Failed to load dashboard data</Alert>
      </Container>
    );
  }

  const divisions = data?.data || [];
  const totalDivisions = divisions.length;
  const totalTeams = divisions.reduce((sum, d) => sum + d.stats.teams, 0);
  const totalMatches = divisions.reduce((sum, d) => sum + d.stats.matches, 0);
  const completedMatches = divisions.reduce((sum, d) => sum + d.stats.completedMatches, 0);

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography color="text.secondary">
            Welcome to your tournament management dashboard
          </Typography>
        </Box>
        {totalDivisions > 0 && (
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleExport}
          >
            Export Stats
          </Button>
        )}
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="caption" display="block">
                    Total Divisions
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {totalDivisions}
                  </Typography>
                </Box>
                <EmojiEvents sx={{ fontSize: 48, color: 'primary.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="caption" display="block">
                    Total Teams
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {totalTeams}
                  </Typography>
                </Box>
                <Groups sx={{ fontSize: 48, color: 'secondary.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="caption" display="block">
                    Total Matches
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {totalMatches}
                  </Typography>
                </Box>
                <SportsTennis sx={{ fontSize: 48, color: 'warning.light', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="caption" display="block">
                    Completion Rate
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0}%
                  </Typography>
                </Box>
                <CheckCircle sx={{
                  fontSize: 48,
                  color: totalMatches > 0 && completedMatches === totalMatches ? 'success.light' : 'info.light',
                  opacity: 0.7
                }} />
              </Box>
              {totalMatches > 0 && (
                <LinearProgress
                  variant="determinate"
                  value={Math.round((completedMatches / totalMatches) * 100)}
                  sx={{ mt: 2, height: 6, borderRadius: 1 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Actions Widget */}
      <PendingActionsWidget />

      {/* Quick Actions Grid */}
      <QuickActionsGrid />

      {/* Recent Activity Feed */}
      <RecentActivityFeed />

      {/* Empty State CTA */}
      {totalDivisions === 0 && (
        <EnhancedEmptyState
          emoji="🎉"
          title="Welcome to BracketIQ!"
          description="Get your tournament up and running in just a few steps."
          steps={[
            'Create a division (e.g., "Summer League 2025")',
            'Add teams manually or import from CSV',
            'Create pools and assign teams',
            'Generate matches automatically',
            'Enter scores and track standings',
          ]}
          actionLabel="Create First Division"
          onAction={handleCreateDivision}
        />
      )}
    </Container>
  );
};
