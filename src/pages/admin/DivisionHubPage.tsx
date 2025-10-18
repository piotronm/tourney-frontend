import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Breadcrumbs,
  Link,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Groups,
  ViewModule,
  SportsTennis,
  Leaderboard,
  Settings as SettingsIcon,
  ArrowForward,
} from '@mui/icons-material';
import { useDivision } from '@/hooks/admin/useDivision';
import { StatusBadge, getTournamentStatus } from '@/components/ui/StatusBadge';
import { MatchProgressBar } from '@/components/ui/MatchProgressBar';

interface NavigationTileProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color?: string;
}

function NavigationTile({ title, description, icon, link, color = 'primary.main' }: NavigationTileProps) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
    >
      <CardActionArea
        onClick={() => navigate(link)}
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ color, mb: 2 }}>
            {icon}
          </Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="primary">
              View
            </Typography>
            <ArrowForward sx={{ fontSize: 16 }} color="primary" />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
}

function StatCard({ title, value, icon, color = 'primary.main' }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" variant="caption" display="block">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Division Hub Page
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Central management hub for a single division within a tournament
 */
export function DivisionHubPage() {
  const { tournamentId, id } = useParams<{ tournamentId: string; id: string }>();
  const navigate = useNavigate();
  const parsedTournamentId = tournamentId ? parseInt(tournamentId, 10) : undefined;
  const divisionId = id ? parseInt(id, 10) : undefined;

  const { data: division, isLoading, error } = useDivision(parsedTournamentId, divisionId);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
      </Container>
    );
  }

  if (error || !division) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load division. Please try again.
        </Alert>
      </Container>
    );
  }

  const status = getTournamentStatus(division);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          href="/admin/tournaments"
          onClick={(e) => { e.preventDefault(); navigate('/admin/tournaments'); }}
          sx={{ cursor: 'pointer' }}
        >
          Tournaments
        </Link>
        <Link
          href={`/admin/tournaments/${tournamentId}`}
          onClick={(e) => { e.preventDefault(); navigate(`/admin/tournaments/${tournamentId}`); }}
          sx={{ cursor: 'pointer' }}
        >
          Tournament
        </Link>
        <Link
          href={`/admin/tournaments/${tournamentId}/divisions`}
          onClick={(e) => { e.preventDefault(); navigate(`/admin/tournaments/${tournamentId}/divisions`); }}
          sx={{ cursor: 'pointer' }}
        >
          Divisions
        </Link>
        <Typography color="text.primary">{division.name}</Typography>
      </Breadcrumbs>

      {/* Header with Status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4">
            {division.name}
          </Typography>
          <StatusBadge status={status} size="medium" />
        </Box>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${id}/edit`)}
        >
          Settings
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Teams"
            value={division.stats?.teams || 0}
            icon={<Groups sx={{ fontSize: 48 }} />}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pools"
            value={division.stats?.pools || 0}
            icon={<ViewModule sx={{ fontSize: 48 }} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Matches"
            value={division.stats?.matches || 0}
            icon={<SportsTennis sx={{ fontSize: 48 }} />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={`${division.stats?.completedMatches || 0}/${division.stats?.matches || 0}`}
            icon={<Leaderboard sx={{ fontSize: 48 }} />}
            color="success.main"
          />
        </Grid>
      </Grid>

      {/* Progress Bar */}
      {(division.stats?.matches || 0) > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <MatchProgressBar
              completed={division.stats?.completedMatches || 0}
              total={division.stats?.matches || 0}
            />
          </CardContent>
        </Card>
      )}

      {/* Navigation Tiles */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Manage Division
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <NavigationTile
            title="Teams"
            description={`Manage ${division.stats?.teams || 0} team${(division.stats?.teams || 0) !== 1 ? 's' : ''}`}
            icon={<Groups sx={{ fontSize: 56 }} />}
            link={`/admin/tournaments/${tournamentId}/divisions/${id}/teams`}
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <NavigationTile
            title="Pools"
            description={`Configure ${division.stats?.pools || 0} pool${(division.stats?.pools || 0) !== 1 ? 's' : ''}`}
            icon={<ViewModule sx={{ fontSize: 56 }} />}
            link={`/admin/tournaments/${tournamentId}/divisions/${id}/pools`}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <NavigationTile
            title="Matches"
            description={`View ${division.stats?.matches || 0} match${(division.stats?.matches || 0) !== 1 ? 'es' : ''}`}
            icon={<SportsTennis sx={{ fontSize: 56 }} />}
            link={`/admin/tournaments/${tournamentId}/divisions/${id}/matches`}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <NavigationTile
            title="Standings"
            description="View current rankings"
            icon={<Leaderboard sx={{ fontSize: 56 }} />}
            link={`/tournaments/${tournamentId}/divisions/${id}/standings`}
            color="success.main"
          />
        </Grid>
      </Grid>

      {/* Quick Actions for this division */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {(division.stats?.teams || 0) === 0 && (
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${id}/teams`)}
              >
                Add Teams
              </Button>
            </Grid>
          )}
          {(division.stats?.pools || 0) === 0 && (division.stats?.teams || 0) > 0 && (
            <Grid item>
              <Button
                variant="contained"
                onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${id}/pools`)}
              >
                Create Pools
              </Button>
            </Grid>
          )}
          {(division.stats?.matches || 0) === 0 && (division.stats?.pools || 0) > 0 && (
            <Grid item>
              <Button
                variant="contained"
                color="warning"
                onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${id}/matches`)}
              >
                Generate Matches
              </Button>
            </Grid>
          )}
          {(division.stats?.matches || 0) > (division.stats?.completedMatches || 0) && (
            <Grid item>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${id}/matches`)}
              >
                Enter Scores
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
