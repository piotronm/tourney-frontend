import type { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import type { Player } from '@/types/player';

interface DeletePlayerDialogProps {
  open: boolean;
  player: Player | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
  isDeleting?: boolean;
}

/**
 * Delete confirmation dialog for players
 * Shows what will be deleted and requires explicit confirmation
 *
 * Features:
 * - Warning icon and color coding
 * - Shows player name and email
 * - Warning about irreversibility
 * - Explains restriction about tournament registrations
 * - Loading state during deletion
 */
export const DeletePlayerDialog: FC<DeletePlayerDialogProps> = ({
  open,
  player,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!player) return null;

  const handleConfirm = () => {
    onConfirm(player.id);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Delete Player?
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography gutterBottom>
          Are you sure you want to delete{' '}
          <strong>{player.name}</strong>?
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
          Email: {player.email}
        </Typography>

        <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
          This will permanently delete the player and all associated data.
        </Alert>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Note: Players with active tournament registrations cannot be deleted.
          You must remove them from all tournaments first.
        </Typography>

        <Alert severity="error">
          This action cannot be undone!
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Player'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
