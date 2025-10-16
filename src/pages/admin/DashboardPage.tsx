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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDivisions } from '@/hooks/admin/useDivisions';

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

  // Fetch all divisions to calculate stats (max 100 due to backend limit)
  const { data, isLoading, isError } = useDivisions({ limit: 100 });

  const handleCreateDivision = () => {
    navigate('/admin/divisions/new');
  };

  const handleManageDivisions = () => {
    navigate('/admin/divisions');
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Welcome to your tournament management dashboard
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Divisions
              </Typography>
              <Typography variant="h3" component="div">
                {totalDivisions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Teams
              </Typography>
              <Typography variant="h3" component="div">
                {totalTeams}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Matches
              </Typography>
              <Typography variant="h3" component="div">
                {totalMatches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Completed Matches
              </Typography>
              <Typography variant="h3" component="div">
                {completedMatches}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalMatches > 0 ? `${Math.round((completedMatches / totalMatches) * 100)}%` : '0%'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateDivision}
            >
              Create Division
            </Button>
            <Button
              variant="outlined"
              onClick={handleManageDivisions}
            >
              Manage Divisions
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Empty State CTA */}
      {totalDivisions === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" gutterBottom>
            Get Started
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Create your first tournament division to begin
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateDivision}
            sx={{ mt: 2 }}
          >
            Create First Division
          </Button>
        </Box>
      )}
    </Container>
  );
};
