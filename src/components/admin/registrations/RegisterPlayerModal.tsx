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
import { useCreateRegistration } from '@/hooks/admin/useRegistrations';
import { usePlayers } from '@/hooks/admin/usePlayers';
import { useDivisions } from '@/hooks/admin/useDivisions';
import type { Player } from '@/types/player';
import type { Division } from '@/types/division';

interface RegisterPlayerModalProps {
  open: boolean;
  tournamentId: number;
  onClose: () => void;
}

export function RegisterPlayerModal({
  open,
  tournamentId,
  onClose
}: RegisterPlayerModalProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedDivisions, setSelectedDivisions] = useState<Division[]>([]);
  const [notes, setNotes] = useState('');

  const createMutation = useCreateRegistration(tournamentId);
  const { data: playersData, isLoading: playersLoading } = usePlayers({
    search: undefined,
    limit: 100,
    offset: 0
  });
  const { data: divisionsData, isLoading: divisionsLoading } = useDivisions(
    tournamentId,
    {
      limit: 100,
      offset: 0
    }
  );

  const players = playersData?.data || [];
  const divisions = divisionsData?.data || [];

  useEffect(() => {
    if (!open) {
      setSelectedPlayer(null);
      setSelectedDivisions([]);
      setNotes('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedPlayer || selectedDivisions.length === 0) return;

    await createMutation.mutateAsync({
      playerId: selectedPlayer.id,
      divisionIds: selectedDivisions.map(d => d.id),
      notes: notes || undefined
    });

    onClose();
  };

  const isValid = selectedPlayer && selectedDivisions.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register Player</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <Autocomplete
            options={players}
            getOptionLabel={(player) =>
              `${player.name}${
                player.doublesRating ? ` (${player.doublesRating.toFixed(1)})` : ''
              }`
            }
            renderInput={(params) => (
              <TextField {...params} label="Player *" placeholder="Search players..." />
            )}
            value={selectedPlayer}
            onChange={(_event, newValue) => setSelectedPlayer(newValue)}
            loading={playersLoading}
            disabled={playersLoading}
          />

          <Autocomplete
            multiple
            options={divisions}
            getOptionLabel={(division) => division.name}
            renderInput={(params) => (
              <TextField {...params} label="Divisions *" placeholder="Select divisions..." />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return <Chip key={key} {...tagProps} label={option.name} />;
              })
            }
            value={selectedDivisions}
            onChange={(_event, newValue) => setSelectedDivisions(newValue)}
            loading={divisionsLoading}
            disabled={divisionsLoading}
          />

          <TextField
            label="Notes (Optional)"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={createMutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValid || createMutation.isPending}
        >
          {createMutation.isPending ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Registering...
            </>
          ) : (
            'Register Player'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
