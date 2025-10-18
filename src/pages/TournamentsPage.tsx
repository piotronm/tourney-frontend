/**
 * TournamentsPage - List all active tournaments
 * Phase 3: Tournament hierarchy entry page
 */

import { Container, Typography, Grid, Box } from '@mui/material';
import { useTournaments } from '@/hooks/useTournaments';
import { TournamentCard } from '@/components/tournaments/TournamentCard';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export const TournamentsPage = () => {
  const { data, isLoading, error } = useTournaments();

  if (isLoading) {
    return <Loading message="Loading tournaments..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage error={error} />
      </Container>
    );
  }

  const tournaments = data?.data || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tournaments
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Browse active tournaments and view their divisions, teams, and matches.
      </Typography>

      {tournaments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No tournaments available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Check back later for upcoming tournaments
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {tournaments.map((tournament) => (
            <Grid item xs={12} sm={6} md={4} key={tournament.id}>
              <TournamentCard tournament={tournament} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
