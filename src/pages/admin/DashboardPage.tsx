/**
 * Admin Dashboard Page
 * UPDATED: Phase 1C - Part 1 - Admin Dashboard Landing Page
 *
 * Main landing page for admin users showing navigation tiles
 * to different sections of the admin panel.
 */

import { Box, Typography, Card, CardActionArea, Grid, Chip } from '@mui/material';
import {
  EmojiEvents as TournamentIcon,
  People as PeopleIcon,
  Assessment as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayers } from '@/hooks/admin/usePlayers';

interface DashboardTile {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  description: string;
  path: string | null;
  enabled: boolean;
  color: string;
}

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch player count for dashboard tile
  const { data: playersData } = usePlayers({ search: '', limit: 1, offset: 0 });
  const playerCount = playersData?.total ?? 0;

  const tiles: DashboardTile[] = [
    {
      id: 'tournaments',
      icon: <TournamentIcon sx={{ fontSize: 48 }} />,
      title: 'Tournaments',
      description: 'Manage your tournaments, divisions, and matches',
      path: '/admin/tournaments',
      enabled: true,
      color: 'primary.main',
    },
    {
      id: 'players',
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      title: 'Players',
      subtitle: `${playerCount} registered`,
      description: 'Manage player database, add and edit player information',
      path: '/admin/players',
      enabled: true, // Enabled in Phase 1C-Part 2
      color: 'success.main',
    },
    {
      id: 'analytics',
      icon: <AnalyticsIcon sx={{ fontSize: 48 }} />,
      title: 'Analytics',
      subtitle: '(Coming Soon)',
      description: 'View tournament statistics and player metrics',
      path: null,
      enabled: false,
      color: 'text.disabled',
    },
    {
      id: 'settings',
      icon: <SettingsIcon sx={{ fontSize: 48 }} />,
      title: 'Settings',
      subtitle: '(Coming Soon)',
      description: 'Configure app settings and preferences',
      path: null,
      enabled: false,
      color: 'text.disabled',
    },
  ];

  const handleTileClick = (tile: DashboardTile) => {
    if (tile.enabled && tile.path) {
      navigate(tile.path);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name || 'Admin'}!
        </Typography>
      </Box>

      {/* Dashboard Tiles */}
      <Grid container spacing={3}>
        {tiles.map((tile) => (
          <Grid item xs={12} sm={6} md={6} key={tile.id}>
            <Card
              sx={{
                height: '100%',
                cursor: tile.enabled ? 'pointer' : 'default',
                opacity: tile.enabled ? 1 : 0.6,
                transition: 'all 0.2s',
                '&:hover': tile.enabled ? {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                } : {},
              }}
            >
              <CardActionArea
                onClick={() => handleTileClick(tile)}
                disabled={!tile.enabled}
                sx={{
                  p: 3,
                  height: '100%',
                  minHeight: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                {/* Icon and Title Section */}
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ color: tile.color }}>
                      {tile.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" component="h2">
                        {tile.title}
                      </Typography>
                      {tile.subtitle && (
                        <Typography variant="caption" color="text.secondary">
                          {tile.subtitle}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary">
                    {tile.description}
                  </Typography>
                </Box>

                {/* Status Indicator */}
                {!tile.enabled && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Chip
                      label="Coming Soon"
                      size="small"
                      color="default"
                    />
                  </Box>
                )}
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
