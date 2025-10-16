import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { Container, Typography, Tabs, Tab, Breadcrumbs, Paper } from '@mui/material';
import { Home } from '@mui/icons-material';
import { useDivision } from '@/hooks/useDivision';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export const DivisionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const divisionId = id ? parseInt(id, 10) : undefined;

  const { data: division, isLoading, error, refetch } = useDivision(divisionId);

  const currentTab = location.pathname.includes('/matches') ? 'matches' : 'standings';

  if (isLoading) return <Loading message="Loading division..." />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!division) return <ErrorMessage error={new Error('Division not found')} />;

  return (
    <Container maxWidth="lg">
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <Home sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </Link>
        <Link to="/divisions" style={{ textDecoration: 'none', color: 'inherit' }}>
          Tournaments
        </Link>
        <Typography color="text.primary">{division.name}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom fontWeight="bold">
        {division.name}
      </Typography>

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
            to={`/divisions/${id}/standings`}
          />
          <Tab
            label="Matches"
            value="matches"
            component={Link}
            to={`/divisions/${id}/matches`}
          />
        </Tabs>
      </Paper>

      <Outlet />
    </Container>
  );
};
