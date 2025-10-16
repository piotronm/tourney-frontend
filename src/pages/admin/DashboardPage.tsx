import { Box, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        This is your admin dashboard. More features coming soon!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Placeholder stat cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color="primary.main">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Divisions
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color="secondary.main">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Tournaments
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" color="success.main">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Matches Today
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          ℹ️ This is a placeholder dashboard. Real statistics and features will be added in Phase
          3.
        </Typography>
      </Box>
    </Box>
  );
};
