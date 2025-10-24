import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Alert,
  IconButton,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAddPlayerToDivisions, useRemovePlayerFromDivision } from '@/hooks/admin/useRegistrations';
import { useDivisions } from '@/hooks/admin/useDivisions';
import type { Registration } from '@/types/registration';

interface EditDivisionsDialogProps {
  open: boolean;
  onClose: () => void;
  registration: Registration;
  tournamentId: number;
}

export const EditDivisionsDialog: FC<EditDivisionsDialogProps> = ({
  open,
  onClose,
  registration,
  tournamentId,
}) => {
  const [selectedDivisionIds, setSelectedDivisionIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const { data: divisionsData } = useDivisions(tournamentId, { limit: 100, offset: 0 });
  const addDivisionsMutation = useAddPlayerToDivisions(tournamentId, registration.playerId);
  const removeDivisionMutation = useRemovePlayerFromDivision(tournamentId, registration.playerId);

  const divisions = divisionsData?.data || [];
  const currentDivisionIds = registration.divisions.map(d => d.divisionId);
  const availableDivisions = divisions.filter(d => !currentDivisionIds.includes(d.id));

  useEffect(() => {
    if (!open) {
      setSelectedDivisionIds([]);
      setIsAdding(false);
    }
  }, [open]);

  const handleAddDivisions = () => {
    if (selectedDivisionIds.length === 0) return;

    addDivisionsMutation.mutate(
      { divisionIds: selectedDivisionIds },
      {
        onSuccess: () => {
          setSelectedDivisionIds([]);
          setIsAdding(false);
        },
      }
    );
  };

  const handleRemoveDivision = (divisionId: number, divisionName: string) => {
    const confirmed = window.confirm(
      `Remove ${registration.playerName} from ${divisionName}?\n\n` +
      `If they are on a team in this division, you must remove them from the team first.`
    );

    if (!confirmed) return;

    removeDivisionMutation.mutate(divisionId);
  };

  const handleClose = () => {
    if (!addDivisionsMutation.isPending && !removeDivisionMutation.isPending) {
      onClose();
    }
  };

  const isPending = addDivisionsMutation.isPending || removeDivisionMutation.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Manage Divisions</Typography>
          <IconButton onClick={handleClose} disabled={isPending} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <Alert severity="info">
            Managing divisions for <strong>{registration.playerName}</strong>
          </Alert>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Current Divisions ({registration.divisions.length})
            </Typography>
            <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              {registration.divisions.length > 0 ? (
                registration.divisions.map((div) => (
                  <ListItem
                    key={div.divisionId}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{div.divisionName}</Typography>
                      <Chip
                        size="small"
                        label={div.teamId ? 'On Team' : 'No Team'}
                        color={div.teamId ? 'success' : 'warning'}
                        icon={div.teamId ? <CheckCircleIcon /> : <WarningIcon />}
                        variant="outlined"
                      />
                    </Box>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveDivision(div.divisionId, div.divisionName)}
                      disabled={isPending}
                    >
                      Remove
                    </Button>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <Typography variant="body2" color="text.secondary">
                    No divisions assigned
                  </Typography>
                </ListItem>
              )}
            </List>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">
                Add More Divisions
              </Typography>
              {!isAdding && availableDivisions.length > 0 && (
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAdding(true)}
                  disabled={isPending}
                >
                  Add Divisions
                </Button>
              )}
            </Box>

            {isAdding && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Divisions</InputLabel>
                  <Select
                    multiple
                    value={selectedDivisionIds}
                    onChange={(e) => setSelectedDivisionIds(e.target.value as number[])}
                    input={<OutlinedInput label="Select Divisions" />}
                    renderValue={(selected) => {
                      const names = availableDivisions
                        .filter(d => selected.includes(d.id))
                        .map(d => d.name);
                      return names.length > 0 ? names.join(', ') : 'Select divisions...';
                    }}
                    disabled={isPending}
                  >
                    {availableDivisions.map((division) => (
                      <MenuItem key={division.id} value={division.id}>
                        <Checkbox checked={selectedDivisionIds.includes(division.id)} />
                        <ListItemText primary={division.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddDivisions}
                    disabled={selectedDivisionIds.length === 0 || isPending}
                  >
                    {addDivisionsMutation.isPending ? 'Adding...' : 'Add Selected'}
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setIsAdding(false);
                      setSelectedDivisionIds([]);
                    }}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}

            {!isAdding && availableDivisions.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Player is already in all divisions
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isPending}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
