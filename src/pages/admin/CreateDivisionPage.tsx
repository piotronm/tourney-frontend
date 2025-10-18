import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DivisionForm } from '@/components/forms/DivisionForm';
import { useCreateDivision } from '@/hooks/admin/useCreateDivision';
import { useTournament } from '@/hooks/admin/useTournament';
import type { DivisionFormData } from '@/schemas/divisionSchema';

/**
 * Create Division Page
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Allows admin to create a new division within a specific tournament
 *
 * Features:
 * - Form validation with Zod
 * - Back navigation to tournament divisions
 * - Success redirect to division list
 * - Error handling via toast
 * - Tournament context breadcrumbs
 */
export const CreateDivisionPage = () => {
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const { mutate: createDivision, isPending } = useCreateDivision();

  const parsedTournamentId = tournamentId ? parseInt(tournamentId, 10) : undefined;

  // Fetch tournament info for breadcrumbs
  const { data: tournament } = useTournament(parsedTournamentId);

  const handleSubmit = (data: DivisionFormData) => {
    if (!parsedTournamentId) return;

    createDivision(
      { tournamentId: parsedTournamentId, data: { name: data.name } },
      {
        onSuccess: () => {
          // Redirect to division list after successful creation
          navigate(`/admin/tournaments/${tournamentId}/divisions`);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate(`/admin/tournaments/${tournamentId}/divisions`);
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
          <Link
            component="button"
            variant="body1"
            onClick={handleCancel}
            sx={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            Divisions
          </Link>
          <Typography color="text.primary">Create Division</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mb: 2 }}
        >
          Back to Divisions
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Create New Division
        </Typography>
        {tournament && (
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
            {tournament.name}
          </Typography>
        )}
      </Box>

      <DivisionForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isPending}
      />
    </Container>
  );
};
