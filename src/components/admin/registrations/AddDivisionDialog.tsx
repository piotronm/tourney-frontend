import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import { useAddPlayerToDivisions } from '@/hooks/admin/useRegistrations';
import { useDivisions } from '@/hooks/admin/useDivisions';
import type { Division } from '@/types/division';

interface AddDivisionDialogProps {
  open: boolean;
  tournamentId: number;
  playerId: number;
  playerName: string;
  currentDivisionIds: number[];
  onClose: () => void;
}

export function AddDivisionDialog({
  open,
  tournamentId,
  playerId,
  playerName,
  currentDivisionIds,
  onClose
}: AddDivisionDialogProps) {
  const [selectedDivisions, setSelectedDivisions] = useState<Division[]>([]);

  const addMutation = useAddPlayerToDivisions(tournamentId, playerId);
  const { data: divisionsData, isLoading: divisionsLoading } = useDivisions(
    tournamentId,
    {
      limit: 100,
      offset: 0
    }
  );

  const divisions = divisionsData?.data || [];
  const availableDivisions = divisions.filter(
    (div) => !currentDivisionIds.includes(div.id)
  );

  useEffect(() => {
    if (!open) {
      setSelectedDivisions([]);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (selectedDivisions.length === 0) return;

    await addMutation.mutateAsync({
      divisionIds: selectedDivisions.map(d => d.id)
    });

    onClose();
  };

  const isValid = selectedDivisions.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Divisions - {playerName}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <Autocomplete
            multiple
            options={availableDivisions}
            getOptionLabel={(division) => division.name}
            renderInput={(params) => (
              <TextField {...params} label="Divisions *" placeholder="Select divisions..." />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} label={option.name} />
              ))
            }
            value={selectedDivisions}
            onChange={(_event, newValue) => setSelectedDivisions(newValue)}
            loading={divisionsLoading}
            disabled={divisionsLoading}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={addMutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValid || addMutation.isPending}
        >
          {addMutation.isPending ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Adding...
            </>
          ) : (
            'Add Divisions'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
