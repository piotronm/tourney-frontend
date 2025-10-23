import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Button,
  Container,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Refresh as RefreshIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useMatches } from '@/hooks/useMatches';
import { usePools } from '@/hooks/admin/usePools';
import { useDivision } from '@/hooks/admin/useDivision';
import { useTournament } from '@/hooks/admin/useTournament';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { MatchCard } from '@/components/matches/MatchCard';
import { ContextBar } from '@/components/admin/ContextBar';
import { BackButton } from '@/components/admin/BackButton';

/**
 * Division Matches Page
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Displays and filters matches for a division within a tournament
 */
export const DivisionMatchesPage = () => {
  const { tournamentId, id } = useParams<{ tournamentId: string; id: string }>();
  const navigate = useNavigate();
  const parsedTournamentId = tournamentId ? parseInt(tournamentId, 10) : undefined;
  const parsedDivisionId = id ? parseInt(id, 10) : undefined;

  const { data: tournament } = useTournament(parsedTournamentId);
  const { data: division, isLoading: divisionLoading } = useDivision(parsedTournamentId, parsedDivisionId);
  const { data: pools } = usePools(parsedTournamentId, parsedDivisionId);

  const [selectedPoolId, setSelectedPoolId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const {
    data: matchesData,
    isLoading: matchesLoading,
    error,
    refetch,
  } = useMatches(parsedTournamentId, parsedDivisionId, {
    poolId: selectedPoolId === 'all' ? undefined : Number(selectedPoolId),
    status: selectedStatus === 'all' ? undefined : (selectedStatus as 'pending' | 'completed'),
  });

  // Loading states
  if (divisionLoading || matchesLoading) {
    return <Loading />;
  }

  // Error states
  if (error) {
    return (
      <Container maxWidth="lg">
        <ErrorMessage message="Failed to load matches" />
      </Container>
    );
  }

  if (!division) {
    return (
      <Container maxWidth="lg">
        <ErrorMessage message="Division not found" />
      </Container>
    );
  }

  // Extract matches from response (handles envelope pattern)
  const matches = matchesData?.data || [];

  // Group matches by pool
  const matchesByPool = matches.reduce((acc, match) => {
    const poolName = match.poolName || 'No Pool';
    if (!acc[poolName]) acc[poolName] = [];
    acc[poolName].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/admin/tournaments')}
        >
          Tournaments
        </Link>
        {tournament && (
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate(`/admin/tournaments/${tournamentId}`)}
          >
            {tournament.name}
          </Link>
        )}
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions`)}
        >
          Divisions
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${id}`)}
        >
          {division?.name}
        </Link>
        <Typography color="text.primary">Matches</Typography>
      </Breadcrumbs>

      {/* Context Bar */}
      {tournament && division && (
        <ContextBar
          tournamentId={parsedTournamentId!}
          tournamentName={tournament.name}
          divisionId={parsedDivisionId!}
          divisionName={division.name}
        />
      )}

      {/* Back Button */}
      <BackButton
        to={`/admin/tournaments/${tournamentId}/divisions/${id}`}
        label="Back to Division"
      />

      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Typography variant="h4" fontWeight="bold">
            Manage Matches
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {division?.name}
          </Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Pool</InputLabel>
          <Select
            value={selectedPoolId}
            label="Pool"
            onChange={(e) => setSelectedPoolId(e.target.value)}
          >
            <MenuItem value="all">All Pools</MenuItem>
            {pools?.map((pool) => (
              <MenuItem key={pool.id} value={pool.id.toString()}>
                {pool.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <MenuItem value="all">All Matches</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ flex: 1 }} />

        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
          Total: {matches.length} matches
        </Typography>
      </Stack>

      {/* Empty State */}
      {matches.length === 0 && (
        <EmptyState
          title="No matches found"
          description={
            selectedPoolId !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Generate matches from the Pools page to create a schedule'
          }
        />
      )}

      {/* Matches List - Grouped by Pool */}
      {Object.entries(matchesByPool).map(([poolName, poolMatches]) => (
        <Box key={poolName} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {poolName} ({poolMatches.length} matches)
          </Typography>
          <Stack spacing={2}>
            {poolMatches.map((match) => (
              <MatchCard key={match.id} match={match} showActions />
            ))}
          </Stack>
        </Box>
      ))}
    </Container>
  );
};
