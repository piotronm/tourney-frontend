import { Card, CardActionArea, CardContent, Typography, Grid, Box } from '@mui/material';
import { Add, Upload, SportsTennis, AutoAwesome } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

export function QuickActionsGrid() {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: 'create-division',
      title: 'Create Division',
      description: 'Start a new tournament division',
      icon: <Add sx={{ fontSize: 48 }} />,
      color: 'primary.main',
      path: '/admin/divisions/new',
    },
    {
      id: 'import-teams',
      title: 'Import Teams',
      description: 'Bulk import teams from CSV',
      icon: <Upload sx={{ fontSize: 48 }} />,
      color: 'success.main',
      path: '/admin/divisions', // Will need to select division first
    },
    {
      id: 'enter-scores',
      title: 'Enter Scores',
      description: 'Update match results',
      icon: <SportsTennis sx={{ fontSize: 48 }} />,
      color: 'warning.main',
      path: '/admin/divisions', // Will need to select division first
    },
    {
      id: 'generate-matches',
      title: 'Generate Matches',
      description: 'Create round-robin schedule',
      icon: <AutoAwesome sx={{ fontSize: 48 }} />,
      color: 'info.main',
      path: '/admin/divisions', // Will need to select division first
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.2s',
                border: '2px solid transparent',
                '&:hover': {
                  borderColor: action.color,
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(action.path)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                }}
              >
                <CardContent
                  sx={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box sx={{ color: action.color }}>{action.icon}</Box>
                  <Typography variant="h6" component="div" fontWeight={600}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
