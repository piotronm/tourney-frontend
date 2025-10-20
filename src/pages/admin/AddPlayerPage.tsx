import { Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PlayerForm } from '@/components/forms/PlayerForm';
import { useCreatePlayer } from '@/hooks/admin/usePlayers';
import type { PlayerFormData } from '@/schemas/playerSchema';

/**
 * Add Player Page
 * Form page for creating a new player
 *
 * Features:
 * - PlayerForm component with validation
 * - Create player mutation
 * - Navigates to player list on success
 * - Cancel returns to player list
 */
export const AddPlayerPage = () => {
  const navigate = useNavigate();
  const { mutate: createPlayer, isPending } = useCreatePlayer();

  const handleSubmit = async (data: PlayerFormData) => {
    createPlayer(data, {
      onSuccess: () => {
        navigate('/admin/players');
      },
    });
  };

  const handleCancel = () => {
    navigate('/admin/players');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Add Player
        </Typography>
        <PlayerForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isPending}
        />
      </Box>
    </Container>
  );
};
