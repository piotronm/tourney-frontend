import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TeamForm } from '@/components/forms/TeamForm';
import { useTeam } from '@/hooks/admin/useTeam';
import { useUpdateTeam } from '@/hooks/admin/useUpdateTeam';
import { useDivision } from '@/hooks/admin/useDivision';
import type { TeamFormData } from '@/schemas/teamSchema';

/**
 * Edit Team Page
 * Allows admin to edit an existing team
 *
 * Features:
 * - Loads existing team data
 * - Pre-fills form with current values
 * - Form validation with Zod
 * - Back navigation
 * - Success redirect
 */
export const EditTeamPage = () => {
  const navigate = useNavigate();
  const { divisionId, teamId } = useParams<{ divisionId: string; teamId: string }>();
  const parsedDivisionId = parseInt(divisionId!, 10);
  const parsedTeamId = parseInt(teamId!, 10);

  const { data: division } = useDivision(parsedDivisionId);
  const { data: team, isLoading, isError } = useTeam(parsedDivisionId, parsedTeamId);
  const { mutate: updateTeam, isPending } = useUpdateTeam();

  const handleSubmit = (data: TeamFormData) => {
    updateTeam(
      {
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
          navigate(`/admin/divisions/${divisionId}/teams`);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate(`/admin/divisions/${divisionId}/teams`);
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
          {division?.name}
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
