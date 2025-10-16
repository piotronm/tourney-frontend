import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import type { Pool } from '@/types/pool';

interface DeletePoolDialogProps {
  open: boolean;
  pool: Pool | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * Delete Pool Confirmation Dialog
 * Shows confirmation dialog before deleting a pool
 *
 * Features:
 * - Displays pool name
 * - Warning if pool has teams assigned
 * - Shows team count
 * - Loading state during deletion
 * - Cannot be dismissed during deletion
 */
export const DeletePoolDialog = ({
  open,
  pool,
  onClose,
  onConfirm,
  isLoading,
}: DeletePoolDialogProps) => {
  if (!pool) return null;

  const hasTeams = pool.teams && pool.teams.length > 0;
  const teamCount = pool.teams?.length || 0;

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning color="error" />
          Delete Pool?
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete <strong>{pool.name}</strong>?
        </Typography>

        {hasTeams && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This pool has {teamCount} team{teamCount !== 1 ? 's' : ''} assigned.
            Deleting will unassign {teamCount === 1 ? 'this team' : 'these teams'} from the pool.
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : 'Delete Pool'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
