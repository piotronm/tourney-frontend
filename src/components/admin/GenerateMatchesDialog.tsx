import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import { useGenerateMatches } from '@/hooks/admin/useGenerateMatches';
import type { Pool } from '@/api/types';

interface GenerateMatchesDialogProps {
  open: boolean;
  divisionId: string;
  pools: Pool[];
  onClose: () => void;
}

export const GenerateMatchesDialog = ({
  open,
  divisionId,
  pools,
  onClose,
}: GenerateMatchesDialogProps) => {
  const { mutate: generateMatches, isPending } = useGenerateMatches(divisionId);

  const [format, setFormat] = useState<'ROUND_ROBIN' | 'SINGLE_ELIM'>('ROUND_ROBIN');

  /**
   * Calculate total number of matches for round-robin
   * Formula: n * (n-1) / 2 per pool
   */
  const calculateMatchCount = () => {
    if (format !== 'ROUND_ROBIN') return 0;

    return pools.reduce((total, pool) => {
      const teamCount = pool.teams?.length || 0;
      if (teamCount < 2) return total;

      // Round robin: each team plays every other team once
      const poolMatches = (teamCount * (teamCount - 1)) / 2;
      return total + poolMatches;
    }, 0);
  };

  const handleGenerate = () => {
    generateMatches(
      { format },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const matchCount = calculateMatchCount();
  const hasTeams = pools.some((pool) => (pool.teams?.length || 0) >= 2);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate Match Schedule</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Format Selection */}
          <FormControl>
            <FormLabel>Tournament Format</FormLabel>
            <RadioGroup
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
            >
              <FormControlLabel
                value="ROUND_ROBIN"
                control={<Radio />}
                label="Round Robin (every team plays every other team once)"
              />
              <FormControlLabel
                value="SINGLE_ELIM"
                control={<Radio />}
                label="Single Elimination (coming soon)"
                disabled
              />
            </RadioGroup>
          </FormControl>

          {/* Preview Section */}
          {hasTeams ? (
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Preview:
              </Typography>
              {pools.map((pool) => {
                const teamCount = pool.teams?.length || 0;
                const poolMatches =
                  teamCount >= 2 ? (teamCount * (teamCount - 1)) / 2 : 0;
                return (
                  <Typography key={pool.id} variant="body2">
                    • {pool.name}: {poolMatches} matches ({teamCount} teams)
                  </Typography>
                );
              })}
              <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                Total: {matchCount} matches
              </Typography>
            </Box>
          ) : (
            <Alert severity="warning">
              No pools have enough teams (minimum 2 teams per pool). Assign
              teams to pools first.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={isPending || !hasTeams}
        >
          {isPending ? 'Generating...' : 'Generate Matches'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
