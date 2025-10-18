import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TeamForm } from '@/components/forms/TeamForm';
import { useCreateTeam } from '@/hooks/admin/useCreateTeam';
import { useDivision } from '@/hooks/admin/useDivision';
import { useTournament } from '@/hooks/admin/useTournament';
import type { TeamFormData } from '@/schemas/teamSchema';

/**
 * Add Team Page
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Allows admin to add a new team to a division in a tournament
 *
 * Features:
 * - Form validation with Zod
 * - Pool assignment dropdown
 * - Back navigation
 * - Success redirect to teams list
 * - Tournament context breadcrumbs
 */
export const AddTeamPage = () => {
  const navigate = useNavigate();
  const { tournamentId, id } = useParams<{ tournamentId: string; id: string }>();
  const parsedTournamentId = tournamentId ? parseInt(tournamentId, 10) : undefined;
  const parsedDivisionId = id ? parseInt(id, 10) : undefined;

  const { data: tournament } = useTournament(parsedTournamentId);
  const { data: division } = useDivision(parsedTournamentId, parsedDivisionId);
  const { mutate: createTeam, isPending } = useCreateTeam();

  const handleSubmit = (data: TeamFormData) => {
    if (!parsedTournamentId || !parsedDivisionId) return;

    createTeam(
      {
        tournamentId: parsedTournamentId,
        divisionId: parsedDivisionId,
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
          <Typography color="text.primary">Add Team</Typography>
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
          Add New Team
        </Typography>
        <Typography color="text.secondary">
          {division?.name}
        </Typography>
      </Box>

      <TeamForm
        mode="create"
        pools={division?.pools || []}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isPending}
      />
    </Container>
  );
};
