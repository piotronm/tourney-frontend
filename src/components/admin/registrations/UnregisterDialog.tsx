import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { useDeleteRegistration } from '@/hooks/admin/useRegistrations';
import type { Registration } from '@/types/registration';

interface UnregisterDialogProps {
  open: boolean;
  registration: Registration;
  tournamentId: number;
  onClose: () => void;
}

export function UnregisterDialog({
  open,
  registration,
  tournamentId,
  onClose
}: UnregisterDialogProps) {
  const deleteMutation = useDeleteRegistration(tournamentId);

  const handleConfirm = async () => {
    await deleteMutation.mutateAsync(registration.id);
    onClose();
  };

  const hasPartner = registration.pairingType === 'has_partner' && registration.partner;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Unregister Player?</DialogTitle>

      <DialogContent>
        <Typography gutterBottom>
          Are you sure you want to unregister{' '}
          <strong>
            {registration.player.name}
          </strong>{' '}
          from <strong>{registration.divisionName}</strong>?
        </Typography>

        {hasPartner && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This player is registered with{' '}
            <strong>
              {registration.partner!.name}
            </strong>
            . Their partner will be automatically updated to "Needs Partner" status.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={deleteMutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Unregistering...' : 'Unregister'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
