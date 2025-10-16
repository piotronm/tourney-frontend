import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TeamForm } from '@/components/forms/TeamForm';
import { useCreateTeam } from '@/hooks/admin/useCreateTeam';
import { useDivision } from '@/hooks/admin/useDivision';
import type { TeamFormData } from '@/schemas/teamSchema';

/**
 * Add Team Page
 * Allows admin to add a new team to a division
 *
 * Features:
 * - Form validation with Zod
 * - Pool assignment dropdown
 * - Back navigation
 * - Success redirect to teams list
 */
export const AddTeamPage = () => {
  const navigate = useNavigate();
  const { divisionId } = useParams<{ divisionId: string }>();
  const parsedDivisionId = parseInt(divisionId!, 10);

  const { data: division } = useDivision(parsedDivisionId);
  const { mutate: createTeam, isPending } = useCreateTeam();

  const handleSubmit = (data: TeamFormData) => {
    createTeam(
      {
        divisionId: parsedDivisionId,
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
