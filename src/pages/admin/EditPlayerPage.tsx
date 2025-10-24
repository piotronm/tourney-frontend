import { Box, Typography, Container, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayerForm } from '@/components/forms/PlayerForm';
import { usePlayer, useUpdatePlayer } from '@/hooks/admin/usePlayers';
import type { PlayerFormData } from '@/schemas/playerSchema';

/**
 * Edit Player Page
 * Form page for editing an existing player
 *
 * Features:
 * - Fetches player data by ID
 * - PlayerForm component pre-filled with existing data
 * - Update player mutation
 * - Email field disabled (cannot be changed)
 * - Navigates to player list on success
 * - Cancel returns to player list
 * - Loading and error states
 */
export const EditPlayerPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const playerId = id ? parseInt(id, 10) : 0;

  const { data: player, isLoading, isError, error } = usePlayer(playerId);
  const { mutate: updatePlayer, isPending } = useUpdatePlayer();

  const handleSubmit = async (data: PlayerFormData) => {
    if (!player) return;

    updatePlayer(
      { id: player.id, data },
      {
        onSuccess: () => {
          navigate('/admin/players');
        },
      }
    );
  };

  const handleCancel = () => {
    navigate('/admin/players');
  };

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError || !player) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 3 }}>
          <Alert severity="error">
            {error?.message || 'Player not found'}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Edit Player: {player.name}
        </Typography>
        <PlayerForm
          key={player.id} // Force re-mount when player data changes
          mode="edit"
          defaultValues={player}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isPending}
        />
      </Box>
    </Container>
  );
};
