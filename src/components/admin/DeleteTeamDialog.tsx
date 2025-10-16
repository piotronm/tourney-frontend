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
import type { Team } from '@/types/team';

interface DeleteTeamDialogProps {
  open: boolean;
  team: Team | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

/**
 * Delete confirmation dialog
 * Shows what will be deleted and requires explicit confirmation
 *
 * Features:
 * - Warning icon and color coding
 * - Shows team name and pool assignment
 * - Cannot be undone warning
 * - Loading state during deletion
 */
export const DeleteTeamDialog: FC<DeleteTeamDialogProps> = ({
  open,
  team,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!team) return null;

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Delete Team?
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography gutterBottom>
          Are you sure you want to delete <strong>"{team.name}"</strong>?
        </Typography>

        {team.poolName && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This team is assigned to{' '}
            <strong>{team.poolName}</strong>
            {team.poolSeed && ` (Seed ${team.poolSeed})`}
          </Typography>
        )}

        <Alert severity="warning" sx={{ mt: 2 }}>
          This will remove the team from:
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>All scheduled matches</li>
            <li>Pool standings</li>
            <li>Tournament bracket</li>
          </ul>
        </Alert>

        <Alert severity="error" sx={{ mt: 2 }}>
          This action cannot be undone!
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Team'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
