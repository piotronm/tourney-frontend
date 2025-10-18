import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Button, Alert, CircularProgress, Breadcrumbs, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DivisionForm } from '@/components/forms/DivisionForm';
import { useDivision } from '@/hooks/admin/useDivision';
import { useUpdateDivision } from '@/hooks/admin/useUpdateDivision';
import { useTournament } from '@/hooks/admin/useTournament';
import type { DivisionFormData } from '@/schemas/divisionSchema';

/**
 * Edit Division Page
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Allows admin to edit an existing division within a tournament
 *
 * Features:
 * - Loads existing division data
 * - Pre-fills form with current values
 * - Form validation with Zod
 * - Back navigation to divisions
 * - Success navigates back to divisions list
 * - Error handling via toast
 * - Tournament context breadcrumbs
 */
export const EditDivisionPage = () => {
  const navigate = useNavigate();
  const { tournamentId, id } = useParams<{ tournamentId: string; id: string }>();
  const parsedTournamentId = tournamentId ? parseInt(tournamentId, 10) : undefined;
  const divisionId = Number(id);

  // Fetch tournament info for breadcrumbs
  const { data: tournament } = useTournament(parsedTournamentId);
  const { data: division, isLoading, isError } = useDivision(parsedTournamentId, divisionId);
  const { mutate: updateDivision, isPending } = useUpdateDivision();

  const handleSubmit = (data: DivisionFormData) => {
    if (!parsedTournamentId) return;

    updateDivision(
      { tournamentId: parsedTournamentId, divisionId, data: { name: data.name } },
      {
        onSuccess: () => {
          // Navigate back to divisions list
          navigate(`/admin/tournaments/${tournamentId}/divisions`);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate(`/admin/tournaments/${tournamentId}/divisions`);
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
  if (isError || !division) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">Failed to load division</Alert>
        <Button onClick={handleCancel} sx={{ mt: 2 }}>
          Back to Divisions
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
          <Link
            component="button"
            variant="body1"
            onClick={handleCancel}
            sx={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            Divisions
          </Link>
          <Typography color="text.primary">Edit Division</Typography>
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
          Edit Division
        </Typography>
        {tournament && (
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
            {tournament.name} • {division.name}
          </Typography>
        )}
      </Box>

      <DivisionForm
        mode="edit"
        defaultValues={{ name: division.name }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isPending}
      />
    </Container>
  );
};
