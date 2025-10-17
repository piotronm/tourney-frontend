import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stack,
  Typography,
  Box,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useUpdateMatchScore } from '@/hooks/admin/useUpdateMatchScore';
import type { Match, GameScore, MatchStatus } from '@/api/types';

interface ScoreEntryDialogProps {
  open: boolean;
  onClose: () => void;
  match: Match;
  divisionId: number;
}

export function ScoreEntryDialog({
  open,
  onClose,
  match,
  divisionId,
}: ScoreEntryDialogProps) {
  // Form state for game scores
  const [game1TeamA, setGame1TeamA] = useState<string>('');
  const [game1TeamB, setGame1TeamB] = useState<string>('');
  const [game2TeamA, setGame2TeamA] = useState<string>('');
  const [game2TeamB, setGame2TeamB] = useState<string>('');
  const [game3TeamA, setGame3TeamA] = useState<string>('');
  const [game3TeamB, setGame3TeamB] = useState<string>('');

  // Form state for status and notes
  const [status, setStatus] = useState<MatchStatus>('completed');
  const [notes, setNotes] = useState<string>('');

  // Validation errors
  const [errors, setErrors] = useState<string[]>([]);

  // React Query mutation hook
  const { mutate: updateScore, isPending } = useUpdateMatchScore({
    matchId: match.id,
    divisionId,
  });

  // Load existing scores when dialog opens
  useEffect(() => {
    if (match.scoreJson?.games) {
      const games = match.scoreJson.games;

      // Game 1
      if (games[0]) {
        setGame1TeamA(String(games[0].teamA));
        setGame1TeamB(String(games[0].teamB));
      }

      // Game 2
      if (games[1]) {
        setGame2TeamA(String(games[1].teamA));
        setGame2TeamB(String(games[1].teamB));
      }

      // Game 3
      if (games[2]) {
        setGame3TeamA(String(games[2].teamA));
        setGame3TeamB(String(games[2].teamB));
      }
    }

    // Load existing status
    if (match.status) {
      setStatus(match.status);
    }

    // Load existing notes
    if (match.scoreJson?.notes) {
      setNotes(match.scoreJson.notes);
    }
  }, [match]);

  // Reset form when dialog closes
  const handleClose = () => {
    setGame1TeamA('');
    setGame1TeamB('');
    setGame2TeamA('');
    setGame2TeamB('');
    setGame3TeamA('');
    setGame3TeamB('');
    setStatus('completed');
    setNotes('');
    setErrors([]);
    onClose();
  };

  // Validation and save handler
  const handleSave = () => {
    const validationErrors: string[] = [];
    const games: GameScore[] = [];

    // Validate Game 1 (required)
    if (!game1TeamA || !game1TeamB) {
      validationErrors.push('Game 1 scores are required');
    } else {
      const g1A = parseInt(game1TeamA, 10);
      const g1B = parseInt(game1TeamB, 10);

      if (isNaN(g1A) || isNaN(g1B)) {
        validationErrors.push('Game 1 scores must be numbers');
      } else if (g1A < 0 || g1B < 0) {
        validationErrors.push('Game 1 scores cannot be negative');
      } else if (g1A > 99 || g1B > 99) {
        validationErrors.push('Game 1 scores cannot exceed 99');
      } else {
        games.push({ teamA: g1A, teamB: g1B });
      }
    }

    // Validate Game 2 (optional)
    if (game2TeamA || game2TeamB) {
      if (!game2TeamA || !game2TeamB) {
        validationErrors.push('Game 2: Both scores required if entering Game 2');
      } else {
        const g2A = parseInt(game2TeamA, 10);
        const g2B = parseInt(game2TeamB, 10);

        if (isNaN(g2A) || isNaN(g2B)) {
          validationErrors.push('Game 2 scores must be numbers');
        } else if (g2A < 0 || g2B < 0) {
          validationErrors.push('Game 2 scores cannot be negative');
        } else if (g2A > 99 || g2B > 99) {
          validationErrors.push('Game 2 scores cannot exceed 99');
        } else {
          games.push({ teamA: g2A, teamB: g2B });
        }
      }
    }

    // Validate Game 3 (optional)
    if (game3TeamA || game3TeamB) {
      if (!game3TeamA || !game3TeamB) {
        validationErrors.push('Game 3: Both scores required if entering Game 3');
      } else {
        const g3A = parseInt(game3TeamA, 10);
        const g3B = parseInt(game3TeamB, 10);

        if (isNaN(g3A) || isNaN(g3B)) {
          validationErrors.push('Game 3 scores must be numbers');
        } else if (g3A < 0 || g3B < 0) {
          validationErrors.push('Game 3 scores cannot be negative');
        } else if (g3A > 99 || g3B > 99) {
          validationErrors.push('Game 3 scores cannot exceed 99');
        } else {
          games.push({ teamA: g3A, teamB: g3B });
        }
      }
    }

    // Show errors if validation failed
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors and submit
    setErrors([]);

    updateScore(
      {
        scoreJson: {
          games,
          notes: notes.trim() || undefined,
        },
        status,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  // Check if Team B exists (not a BYE match)
  const isBYEMatch = !match.teamBName;

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isPending}
    >
      <DialogTitle>
        Enter Score
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {match.poolName} • Round {match.roundNumber} • Match {match.matchNumber}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Error Alert */}
          {errors.length > 0 && (
            <Alert severity="error">
              {errors.map((err, idx) => (
                <div key={idx}>• {err}</div>
              ))}
            </Alert>
          )}

          {/* Team Names Display */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {match.teamAName} vs {match.teamBName || 'BYE'}
            </Typography>
            {isBYEMatch && (
              <Typography variant="caption" color="warning.main">
                ⚠️ BYE match - Only {match.teamAName} scores
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Game 1 (Required) */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight="medium">
              Game 1 <Typography component="span" color="error">*</Typography>
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label={match.teamAName}
                value={game1TeamA}
                onChange={(e) => setGame1TeamA(e.target.value)}
                type="number"
                inputProps={{
                  min: 0,
                  max: 99,
                  inputMode: 'numeric',
                }}
                fullWidth
                disabled={isPending}
                autoFocus
              />
              <Typography variant="h6" color="text.secondary">
                -
              </Typography>
              <TextField
                label={match.teamBName || 'BYE'}
                value={game1TeamB}
                onChange={(e) => setGame1TeamB(e.target.value)}
                type="number"
                inputProps={{
                  min: 0,
                  max: 99,
                  inputMode: 'numeric',
                }}
                fullWidth
                disabled={isBYEMatch || isPending}
              />
            </Stack>
          </Box>

          {/* Game 2 (Optional) */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight="medium">
              Game 2 <Typography component="span" color="text.secondary" fontSize="0.875rem">(Optional)</Typography>
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label={match.teamAName}
                value={game2TeamA}
                onChange={(e) => setGame2TeamA(e.target.value)}
                type="number"
                inputProps={{
                  min: 0,
                  max: 99,
                  inputMode: 'numeric',
                }}
                fullWidth
                disabled={isPending}
              />
              <Typography variant="h6" color="text.secondary">
                -
              </Typography>
              <TextField
                label={match.teamBName || 'BYE'}
                value={game2TeamB}
                onChange={(e) => setGame2TeamB(e.target.value)}
                type="number"
                inputProps={{
                  min: 0,
                  max: 99,
                  inputMode: 'numeric',
                }}
                fullWidth
                disabled={isBYEMatch || isPending}
              />
            </Stack>
          </Box>

          {/* Game 3 (Optional) */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight="medium">
              Game 3 <Typography component="span" color="text.secondary" fontSize="0.875rem">(Optional)</Typography>
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label={match.teamAName}
                value={game3TeamA}
                onChange={(e) => setGame3TeamA(e.target.value)}
                type="number"
                inputProps={{
                  min: 0,
                  max: 99,
                  inputMode: 'numeric',
                }}
                fullWidth
                disabled={isPending}
              />
              <Typography variant="h6" color="text.secondary">
                -
              </Typography>
              <TextField
                label={match.teamBName || 'BYE'}
                value={game3TeamB}
                onChange={(e) => setGame3TeamB(e.target.value)}
                type="number"
                inputProps={{
                  min: 0,
                  max: 99,
                  inputMode: 'numeric',
                }}
                fullWidth
                disabled={isBYEMatch || isPending}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Match Status */}
          <FormControl disabled={isPending}>
            <FormLabel>Match Status</FormLabel>
            <RadioGroup
              value={status}
              onChange={(e) => setStatus(e.target.value as MatchStatus)}
            >
              <FormControlLabel
                value="completed"
                control={<Radio />}
                label="✅ Final Score"
              />
              <FormControlLabel
                value="in_progress"
                control={<Radio />}
                label="⏳ In Progress"
              />
              <FormControlLabel
                value="walkover"
                control={<Radio />}
                label="🚶 Walkover"
              />
              <FormControlLabel
                value="forfeit"
                control={<Radio />}
                label="🏳️ Forfeit"
              />
              <FormControlLabel
                value="cancelled"
                control={<Radio />}
                label="❌ Cancelled"
              />
              <FormControlLabel
                value="pending"
                control={<Radio />}
                label="📅 Reset to Pending"
              />
            </RadioGroup>
          </FormControl>

          {/* Notes */}
          <TextField
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            placeholder="e.g., injury, time limit, weather delay"
            disabled={isPending}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : undefined}
        >
          {isPending ? 'Saving...' : 'Save Score'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
