import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
  Box,
  Alert,
  Typography,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface DeleteAllPlayersDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalPlayers: number;
}

/**
 * DeleteAllPlayersDialog Component
 *
 * Strong confirmation dialog for deleting all players
 * Requires typing "DELETE ALL PLAYERS" to confirm
 *
 * Safety features:
 * - Shows exact count of players to be deleted
 * - Multiple warning messages
 * - Requires typing confirmation phrase
 * - Confirm button disabled until text matches
 * - Red error styling throughout
 */
export function DeleteAllPlayersDialog({
  open,
  onClose,
  onConfirm,
  totalPlayers,
}: DeleteAllPlayersDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const CONFIRM_PHRASE = 'DELETE ALL PLAYERS';

  const handleConfirm = () => {
    if (confirmText === CONFIRM_PHRASE) {
      onConfirm();
      handleClose();
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  const isConfirmed = confirmText === CONFIRM_PHRASE;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="error" />
        Delete All Players?
      </DialogTitle>

      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            ⚠️ DANGER: This action cannot be undone!
          </Typography>
          <Typography variant="body2">
            This will permanently delete{' '}
            <strong>ALL {totalPlayers} players</strong> from the database.
          </Typography>
        </Alert>

        <DialogContentText sx={{ mb: 2 }}>
          This is a <strong>development tool</strong> for quickly clearing test
          data. All player records, including their:
        </DialogContentText>

        <Box component="ul" sx={{ mt: 1, mb: 2, pl: 3 }}>
          <li>Contact information (email, phone)</li>
          <li>DUPR IDs and ratings</li>
          <li>Tournament registrations</li>
          <li>Team assignments</li>
        </Box>

        <DialogContentText sx={{ mb: 2 }}>
          will be <strong>permanently deleted</strong>.
        </DialogContentText>

        <DialogContentText sx={{ mb: 2, fontWeight: 600 }}>
          Type "{CONFIRM_PHRASE}" to confirm:
        </DialogContentText>

        <TextField
          fullWidth
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={CONFIRM_PHRASE}
          autoFocus
          error={confirmText.length > 0 && !isConfirmed}
          helperText={
            confirmText.length > 0 && !isConfirmed
              ? 'Text does not match'
              : ''
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'monospace',
            },
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={!isConfirmed}
        >
          Delete All {totalPlayers} Players
        </Button>
      </DialogActions>
    </Dialog>
  );
}
