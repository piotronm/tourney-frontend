import type { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  Box,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import type { Division } from '@/types/division';

interface DeleteDivisionDialogProps {
  open: boolean;
  division: Division | null;
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
 * - Shows division name
 * - Lists cascade impacts (teams, pools, matches)
 * - Cannot be undone warning
 * - Loading state during deletion
 */
export const DeleteDivisionDialog: FC<DeleteDivisionDialogProps> = ({
  open,
  division,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!division) return null;

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Delete Division?
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography gutterBottom>
          Are you sure you want to delete{' '}
          <strong>"{division.name}"</strong>?
        </Typography>

        <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
          This will permanently delete:
        </Alert>

        <List dense>
          <ListItem>
            <ListItemText
              primary={`${division.stats.teams} teams`}
              secondary="All team data will be lost"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`${division.stats.pools} pools`}
              secondary="Pool structure will be deleted"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`${division.stats.matches} matches`}
              secondary="Match history and scores will be lost"
            />
          </ListItem>
        </List>

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
          {isDeleting ? 'Deleting...' : 'Delete Division'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
