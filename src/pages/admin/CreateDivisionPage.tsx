import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DivisionForm } from '@/components/forms/DivisionForm';
import { useCreateDivision } from '@/hooks/admin/useCreateDivision';
import type { DivisionFormData } from '@/schemas/divisionSchema';

/**
 * Create Division Page
 * Allows admin to create a new tournament division
 *
 * Features:
 * - Form validation with Zod
 * - Back navigation
 * - Success redirect to division list
 * - Error handling via toast
 */
export const CreateDivisionPage = () => {
  const navigate = useNavigate();
  const { mutate: createDivision, isPending } = useCreateDivision();

  const handleSubmit = (data: DivisionFormData) => {
    createDivision(
      { name: data.name },
      {
        onSuccess: () => {
          // Redirect to division list after successful creation
          navigate('/admin/divisions');

          // Alternative: redirect to the new division's detail page
          // navigate(`/divisions/${newDivision.id}/standings`);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate('/admin/divisions');
  };

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
          Create New Division
        </Typography>
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
