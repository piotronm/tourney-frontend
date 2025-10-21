import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import { useGenerateMatches } from '@/hooks/admin/useGenerateMatches';
import type { Pool } from '@/api/types';

interface GenerateMatchesDialogProps {
  open: boolean;
  tournamentId: number;
  divisionId: number;
  pools: Pool[];
  onClose: () => void;
}

/**
 * Generate Matches Dialog
 * UPDATED: Phase 2C - Uses new match generation endpoint
 */
export const GenerateMatchesDialog = ({
  open,
  tournamentId,
  divisionId,
  pools,
  onClose,
}: GenerateMatchesDialogProps) => {
  const { mutate: generateMatches, isPending } = useGenerateMatches();

  /**
   * Calculate total number of matches for round-robin
   * Formula: n * (n-1) / 2 per pool
   */
  const calculateMatchCount = () => {
    return pools.reduce((total, pool) => {
      const teamCount = pool.teams?.length || 0;
      if (teamCount < 2) return total;

      // Round robin: each team plays every other team once
      const poolMatches = (teamCount * (teamCount - 1)) / 2;
      return total + poolMatches;
    }, 0);
  };

  const handleGenerate = () => {
    // Phase 2C: Use new schema (regenerate defaults to false)
    generateMatches(
      { tournamentId, divisionId, data: { regenerate: false } },
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
          {/* Info */}
          <Typography variant="body2" color="text.secondary">
            Generates round-robin matches where every team plays every other team in their pool once.
          </Typography>

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
