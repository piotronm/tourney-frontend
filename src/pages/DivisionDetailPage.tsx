/**
 * DivisionDetailPage - Division detail container with tabs
 * UPDATED: Phase 3 - Now requires tournamentId from route params
 */

import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { Container, Typography, Tabs, Tab, Breadcrumbs, Paper } from '@mui/material';
import { Home } from '@mui/icons-material';
import { useTournament } from '@/hooks/useTournament';
import { useDivision } from '@/hooks/useDivision';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export const DivisionDetailPage = () => {
  const { tournamentId, id } = useParams<{ tournamentId: string; id: string }>();
  const location = useLocation();

  const tid = Number(tournamentId);
  const did = Number(id);

  const { data: tournament } = useTournament(tid);
  const { data: division, isLoading, error, refetch } = useDivision(tid, did);

  const currentTab = location.pathname.includes('/matches') ? 'matches' : 'standings';

  if (isLoading) {
    return <Loading message="Loading division..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage error={error} onRetry={refetch} />
      </Container>
    );
  }

  if (!division) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage error={new Error('Division not found')} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </Link>
        <Link
          to="/tournaments"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Tournaments
        </Link>
        {tournament && (
          <Link
            to={`/tournaments/${tid}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {tournament.name}
          </Link>
        )}
        <Link
          to={`/tournaments/${tid}/divisions`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Divisions
        </Link>
        <Typography color="text.primary">{division.name}</Typography>
      </Breadcrumbs>

      {/* Division Name */}
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {division.name}
      </Typography>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label="Standings"
            value="standings"
            component={Link}
            to="standings"
          />
          <Tab
            label="Matches"
            value="matches"
            component={Link}
            to="matches"
          />
        </Tabs>
      </Paper>

      {/* Child Route Outlet (StandingsPage or MatchesPage) */}
      <Outlet />
    </Container>
  );
};
