/**
 * TournamentDetailPage - Show tournament details and divisions
 * Phase 3: Tournament hierarchy detail page
 */

import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  Groups as TeamsIcon,
  SportsSoccer as MatchesIcon,
} from '@mui/icons-material';
import { useTournament } from '@/hooks/useTournament';
import { useDivisions } from '@/hooks/useDivisions';
import { DivisionCard } from '@/components/divisions/DivisionCard';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatDate } from '@/utils/formatters';

export const TournamentDetailPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const tid = Number(tournamentId);

  const {
    data: tournament,
    isLoading: loadingTournament,
    error: tournamentError,
  } = useTournament(tid);

  const {
    data: divisionsData,
    isLoading: loadingDivisions,
    error: divisionsError,
  } = useDivisions(tid);

  if (loadingTournament) {
    return <Loading message="Loading tournament..." />;
  }

  if (tournamentError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage error={tournamentError} />
      </Container>
    );
  }

  if (!tournament) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Tournament not found
        </Typography>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'archived':
        return 'warning';
      case 'draft':
      default:
        return 'default';
    }
  };

  const divisions = divisionsData?.data || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Tournament Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="h4" component="h1">
            {tournament.name}
          </Typography>
          <Chip
            label={tournament.status.toUpperCase()}
            color={getStatusColor(tournament.status)}
            size="medium"
          />
        </Box>

        {tournament.description && (
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '800px' }}>
            {tournament.description}
          </Typography>
        )}

        {/* Tournament Dates */}
        {(tournament.startDate || tournament.endDate) && (
          <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 3 }}>
            {tournament.startDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Starts: {formatDate(tournament.startDate)}
                </Typography>
              </Box>
            )}
            {tournament.endDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Ends: {formatDate(tournament.endDate)}
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        {/* Tournament Stats */}
        {tournament.stats && (
          <Stack direction="row" spacing={3} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrophyIcon color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>{tournament.stats.divisions}</strong> Division{tournament.stats.divisions !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TeamsIcon color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>{tournament.stats.teams}</strong> Team{tournament.stats.teams !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MatchesIcon color="action" fontSize="small" />
              <Typography variant="body2">
                <strong>{tournament.stats.matches}</strong> Match{tournament.stats.matches !== 1 ? 'es' : ''}
              </Typography>
            </Box>
            {'completedMatches' in tournament.stats && (
              <Typography variant="body2" color="text.secondary">
                ({tournament.stats.completedMatches} completed)
              </Typography>
            )}
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Divisions Section */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2">
          Divisions
        </Typography>
        <Button
          component={RouterLink}
          to={`/tournaments/${tid}/divisions`}
          variant="outlined"
          size="small"
        >
          View All Divisions
        </Button>
      </Box>

      {loadingDivisions && <Loading message="Loading divisions..." />}

      {divisionsError && <ErrorMessage error={divisionsError} />}

      {!loadingDivisions && !divisionsError && divisions.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No divisions in this tournament
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Divisions will appear here once they are created
          </Typography>
        </Box>
      )}

      {!loadingDivisions && !divisionsError && divisions.length > 0 && (
        <Grid container spacing={3}>
          {divisions.map((division) => (
            <Grid item xs={12} sm={6} md={4} key={division.id}>
              <DivisionCard division={division} tournamentId={tid} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
