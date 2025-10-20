import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { useCreateRegistration } from '@/hooks/admin/useRegistrations';
import { usePlayers } from '@/hooks/admin/usePlayers';
import { useDivisions } from '@/hooks/admin/useDivisions';
import type { PairingType } from '@/types/registration';
import type { Player } from '@/types/player';

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
  const [selectedPartner, setSelectedPartner] = useState<Player | null>(null);
  const [divisionId, setDivisionId] = useState<number | ''>('');
  const [pairingType, setPairingType] = useState<PairingType>('has_partner');
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

  // DEBUG: Log divisions data
  useEffect(() => {
    console.log('=== DIVISIONS DEBUG ===');
    console.log('tournamentId:', tournamentId);
    console.log('divisionsData:', divisionsData);
    console.log('divisionsLoading:', divisionsLoading);
    console.log('divisions array:', divisions);
    console.log('divisions count:', divisions.length);
    console.log('======================');
  }, [tournamentId, divisionsData, divisionsLoading, divisions]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedPlayer(null);
      setSelectedPartner(null);
      setDivisionId('');
      setPairingType('has_partner');
      setNotes('');
    }
  }, [open]);

  // Reset partner when pairing type changes
  useEffect(() => {
    if (pairingType !== 'has_partner') {
      setSelectedPartner(null);
    }
  }, [pairingType]);

  const handleSubmit = async () => {
    if (!selectedPlayer || !divisionId) return;

    await createMutation.mutateAsync({
      playerId: selectedPlayer.id,
      divisionId: divisionId as number,
      partnerId: selectedPartner?.id,
      pairingType,
      notes: notes || undefined
    });

    onClose();
  };

  const isValid =
    selectedPlayer &&
    divisionId &&
    (pairingType !== 'has_partner' || selectedPartner);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register Player</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Player Selection */}
          <Autocomplete
            options={players}
            getOptionLabel={(player) =>
              `${player.firstName} ${player.lastName}${
                player.duprRating ? ` (${player.duprRating})` : ''
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

          {/* Division Selection */}
          <FormControl fullWidth disabled={divisionsLoading}>
            <InputLabel>Division *</InputLabel>
            <Select
              value={divisionId}
              label="Division *"
              onChange={(e) => setDivisionId(e.target.value as number)}
            >
              {divisions.map((div) => (
                <MenuItem key={div.id} value={div.id}>
                  {div.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Pairing Type */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Partner Setup *
            </Typography>
            <RadioGroup
              value={pairingType}
              onChange={(e) => setPairingType(e.target.value as PairingType)}
            >
              <FormControlLabel
                value="has_partner"
                control={<Radio />}
                label="Has Partner"
              />
              <FormControlLabel
                value="needs_partner"
                control={<Radio />}
                label="Needs Partner (will be assigned later)"
              />
              <FormControlLabel
                value="solo"
                control={<Radio />}
                label="Playing Solo (no partner)"
              />
            </RadioGroup>
          </Box>

          {/* Partner Selection (only for has_partner) */}
          {pairingType === 'has_partner' && (
            <Autocomplete
              options={players.filter((p) => p.id !== selectedPlayer?.id)}
              getOptionLabel={(player) =>
                `${player.firstName} ${player.lastName}${
                  player.duprRating ? ` (${player.duprRating})` : ''
                }`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Partner *"
                  placeholder="Search partner..."
                />
              )}
              value={selectedPartner}
              onChange={(_event, newValue) => setSelectedPartner(newValue)}
              loading={playersLoading}
              disabled={playersLoading || !selectedPlayer}
            />
          )}

          {/* Notes */}
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
