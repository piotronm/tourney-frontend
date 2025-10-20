import { Box, Typography, Card, CardContent, CardActionArea, Grid, Chip, CircularProgress, Button } from '@mui/material';
import { Dashboard, Edit, Public, Settings, HowToReg } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTournament } from '@/hooks/admin/useTournament';

export const TournamentAdminHubPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const tid = Number(tournamentId);
  const { data: tournament, isLoading, error } = useTournament(tid);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !tournament) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Tournament not found</Typography>
      </Box>
    );
  }

  const actions = [
    {
      title: 'Manage Registrations',
      icon: <HowToReg sx={{ fontSize: 40 }} />,
      description: 'Register players and manage tournament participants',
      path: `/admin/tournaments/${tid}/registrations`,
      color: 'info.main',
    },
    {
      title: 'Manage Divisions',
      icon: <Dashboard sx={{ fontSize: 40 }} />,
      description: 'Create and manage tournament divisions',
      path: `/admin/tournaments/${tid}/divisions`,
      color: 'primary.main',
    },
    {
      title: 'Edit Tournament',
      icon: <Edit sx={{ fontSize: 40 }} />,
      description: 'Update tournament details and settings',
      path: `/admin/tournaments/${tid}/edit`,
      color: 'secondary.main',
    },
    {
      title: 'View Public Page',
      icon: <Public sx={{ fontSize: 40 }} />,
      description: 'See how tournament appears to public',
      path: `/tournaments/${tid}`,
      color: 'success.main',
    },
    {
      title: 'Settings',
      icon: <Settings sx={{ fontSize: 40 }} />,
      description: 'Configure tournament settings',
      path: `/admin/tournaments/${tid}/settings`,
      color: 'warning.main',
      badge: 'Coming Soon',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h4" component="h1">
            {tournament.name}
          </Typography>
          <Chip
            label={tournament.status.toUpperCase()}
            color={
              tournament.status === 'active' ? 'success' :
              tournament.status === 'draft' ? 'default' :
              tournament.status === 'completed' ? 'primary' :
              'secondary'
            }
          />
        </Box>
        {tournament.description && (
          <Typography variant="body1" color="text.secondary">
            {tournament.description}
          </Typography>
        )}
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Divisions
              </Typography>
              <Typography variant="h4">{tournament.stats.divisions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Teams
              </Typography>
              <Typography variant="h4">{tournament.stats.teams}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Matches
              </Typography>
              <Typography variant="h4">{tournament.stats.matches}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Tiles */}
      <Grid container spacing={3}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.title}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(action.path)}
                sx={{ p: 3, height: '100%', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Box sx={{ color: action.color, mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom align="center">
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {action.description}
                </Typography>
                {action.badge && (
                  <Chip
                    label={action.badge}
                    size="small"
                    color="default"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
