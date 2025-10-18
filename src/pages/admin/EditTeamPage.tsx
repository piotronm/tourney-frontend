import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, Alert, Breadcrumbs, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TeamForm } from '@/components/forms/TeamForm';
import { useTeam } from '@/hooks/admin/useTeam';
import { useUpdateTeam } from '@/hooks/admin/useUpdateTeam';
import { useDivision } from '@/hooks/admin/useDivision';
import { useTournament } from '@/hooks/admin/useTournament';
import type { TeamFormData } from '@/schemas/teamSchema';

/**
 * Edit Team Page
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Allows admin to edit an existing team in a division
 *
 * Features:
 * - Loads existing team data
 * - Pre-fills form with current values
 * - Form validation with Zod
 * - Back navigation
 * - Success redirect
 * - Tournament context breadcrumbs
 */
export const EditTeamPage = () => {
  const navigate = useNavigate();
  const { tournamentId, id, teamId } = useParams<{ tournamentId: string; id: string; teamId: string }>();
  const parsedTournamentId = tournamentId ? parseInt(tournamentId, 10) : undefined;
  const parsedDivisionId = id ? parseInt(id, 10) : undefined;
  const parsedTeamId = teamId ? parseInt(teamId, 10) : undefined;

  const { data: tournament } = useTournament(parsedTournamentId);
  const { data: division } = useDivision(parsedTournamentId, parsedDivisionId);
  const { data: team, isLoading, isError } = useTeam(parsedTournamentId, parsedDivisionId, parsedTeamId);
  const { mutate: updateTeam, isPending } = useUpdateTeam();

  const handleSubmit = (data: TeamFormData) => {
    if (!parsedTournamentId || !parsedDivisionId || !parsedTeamId) return;

    updateTeam(
      {
        tournamentId: parsedTournamentId,
        divisionId: parsedDivisionId,
        teamId: parsedTeamId,
        data: {
          name: data.name,
          poolId: data.poolId ? parseInt(data.poolId) : null,
          poolSeed: data.poolSeed ? parseInt(data.poolSeed) : null,
        },
      },
      {
        onSuccess: () => {
          navigate(`/admin/tournaments/${tournamentId}/divisions/${id}/teams`);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate(`/admin/tournaments/${tournamentId}/divisions/${id}/teams`);
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Error state
  if (isError || !team) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">Failed to load team</Alert>
        <Button onClick={handleCancel} sx={{ mt: 2 }}>
          Back to Teams
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/admin/tournaments')}
            sx={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            Tournaments
          </Link>
          {tournament && (
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate(`/admin/tournaments/${tournamentId}`)}
              sx={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              {tournament.name}
            </Link>
          )}
          {division && (
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${id}`)}
              sx={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              {division.name}
            </Link>
          )}
          <Link
            component="button"
            variant="body1"
            onClick={handleCancel}
            sx={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            Teams
          </Link>
          <Typography color="text.primary">Edit Team</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mb: 2 }}
        >
          Back to Teams
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Edit Team
        </Typography>
        <Typography color="text.secondary">
          {division?.name} • {team?.name}
        </Typography>
      </Box>

      <TeamForm
        key={team.id}
        mode="edit"
        defaultValues={{
          name: team.name,
          poolId: team.poolId ? String(team.poolId) : '',
          poolSeed: team.poolSeed ? String(team.poolSeed) : '',
        }}
        pools={division?.pools || []}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isPending}
      />
    </Container>
  );
};
