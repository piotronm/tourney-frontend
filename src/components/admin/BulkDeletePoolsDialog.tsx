import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  Alert,
  Box,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import type { Pool } from '@/types/pool';

interface BulkDeletePoolsDialogProps {
  open: boolean;
  pools: Pool[];
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * Confirmation dialog for bulk deleting pools
 * Shows list of pools to be deleted and warnings about affected teams
 */
export function BulkDeletePoolsDialog({
  open,
  pools,
  onClose,
  onConfirm,
  isLoading = false,
}: BulkDeletePoolsDialogProps) {
  // Calculate total teams across all selected pools
  const totalTeams = pools.reduce((sum, pool) => {
    const teamCount = pool.teams?.length || 0;
    return sum + teamCount;
  }, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          <span>Delete {pools.length} Pool(s)?</span>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" gutterBottom>
          You are about to delete the following pools:
        </Typography>

        <List
          dense
          sx={{
            maxHeight: 200,
            overflow: 'auto',
            bgcolor: 'grey.50',
            borderRadius: 1,
            p: 1,
            mt: 2,
          }}
        >
          {pools.map((pool) => {
            const teamCount = pool.teams?.length || 0;
            return (
              <ListItem key={pool.id} sx={{ py: 0.5 }}>
                • <strong>{pool.name}</strong> ({teamCount} team{teamCount !== 1 ? 's' : ''})
              </ListItem>
            );
          })}
        </List>

        {totalTeams > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <strong>{totalTeams} team(s)</strong> will be unassigned from these pools.
            <br />
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
              Teams will not be deleted, but will need to be reassigned to pools.
            </Typography>
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 'bold' }}>
          ⚠️ This action cannot be undone.
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
          {isLoading ? 'Deleting...' : `Delete ${pools.length} Pool(s)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
