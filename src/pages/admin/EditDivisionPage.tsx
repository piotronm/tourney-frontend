import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DivisionForm } from '@/components/forms/DivisionForm';
import { useDivision } from '@/hooks/admin/useDivision';
import { useUpdateDivision } from '@/hooks/admin/useUpdateDivision';
import type { DivisionFormData } from '@/schemas/divisionSchema';

/**
 * Edit Division Page
 * Allows admin to edit an existing tournament division
 *
 * Features:
 * - Loads existing division data
 * - Pre-fills form with current values
 * - Form validation with Zod
 * - Back navigation
 * - Success stays on page or redirects
 * - Error handling via toast
 */
export const EditDivisionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const divisionId = Number(id);

  const { data: division, isLoading, isError } = useDivision(divisionId);
  const { mutate: updateDivision, isPending } = useUpdateDivision();

  const handleSubmit = (data: DivisionFormData) => {
    updateDivision(
      { id: divisionId, data: { name: data.name } },
      {
        onSuccess: () => {
          // Option 1: Stay on edit page (shows updated data)
          // (default behavior - no navigation)

          // Option 2: Navigate back to list
          navigate('/admin/divisions');
        },
      }
    );
  };

  const handleCancel = () => {
    navigate('/admin/divisions');
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
        <Button onClick={() => navigate('/admin/divisions')} sx={{ mt: 2 }}>
          Back to Divisions
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
          Back to Divisions
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Edit Division
        </Typography>
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
