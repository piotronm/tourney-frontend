import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import type { Match } from '@/api/types';
import { ScoreEntryDialog } from '@/components/admin/ScoreEntryDialog';
import { MatchStatusChip } from './MatchStatusChip';

interface Props {
  match: Match;
  showActions?: boolean;
}

export const MatchCard = ({ match, showActions = false }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEnterScore = () => {
    setScoreDialogOpen(true);
    handleClose();
  };

  const isCompleted = match.status === 'completed';
  const isBye = !match.teamBName;

  // Render game-by-game scores
  const renderScores = () => {
    if (!match.scoreJson || !match.scoreJson.games || match.scoreJson.games.length === 0) {
      return null;
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
          Scores:
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {match.scoreJson.games.map((game, idx) => (
            <Box key={idx}>
              <Typography variant="body2" fontWeight="medium">
                Game {idx + 1}: {game.teamA}-{game.teamB}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  };

  // Display winner with trophy icon
  const getWinnerDisplay = () => {
    if (!match.winnerTeamId) return null;

    const winnerName = match.winnerTeamId === match.teamAId
      ? match.teamAName
      : match.teamBName;

    return (
      <Chip
        label={`Winner: ${winnerName}`}
        size="small"
        color="success"
        icon={<EmojiEventsIcon />}
        sx={{ mt: 1 }}
      />
    );
  };

  return (
    <Card>
      <CardContent sx={{ position: 'relative' }}>
        {/* LIVE badge for in-progress matches */}
        {match.status === 'in_progress' && (
          <Chip
            label="🔴 LIVE"
            color="error"
            size="small"
            aria-label="Match in progress"
            role="status"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.7 },
              },
            }}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'flex-start' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {match.poolName && (
              <Chip label={match.poolName} size="small" color="primary" />
            )}
            <Typography variant="caption" color="text.secondary">
              Round {match.roundNumber} • Match {match.matchNumber}
            </Typography>
            <MatchStatusChip status={match.status} />
          </Stack>

          {/* Admin Actions Menu */}
          {showActions && (
            <>
              <IconButton onClick={handleClick} size="small">
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Edit Match</MenuItem>
                <MenuItem onClick={handleEnterScore}>Enter Score</MenuItem>
                <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
                  Delete Match
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Team A */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            bgcolor: 'grey.50',
            borderRadius: 1,
            mb: 1,
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            {match.teamAName}
          </Typography>
          {isCompleted && (
            <Typography variant="h5" fontWeight="bold" color="primary">
              {match.scoreA}
            </Typography>
          )}
        </Box>

        {/* VS or BYE */}
        <Box sx={{ textAlign: 'center', my: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {isBye ? 'BYE' : 'VS'}
          </Typography>
        </Box>

        {/* Team B */}
        {!isBye && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1.5,
              bgcolor: 'grey.50',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {match.teamBName}
            </Typography>
            {isCompleted && (
              <Typography variant="h5" fontWeight="bold" color="primary">
                {match.scoreB}
              </Typography>
            )}
          </Box>
        )}

        {/* Game-by-game scores */}
        {renderScores()}

        {/* Winner display */}
        {getWinnerDisplay()}

        <Divider sx={{ my: 1 }} />

        {/* Court and Time */}
        {(match.courtLabel || match.scheduledAt) && (
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            {match.courtLabel && (
              <Typography variant="caption" color="text.secondary">
                🏐 {match.courtLabel}
              </Typography>
            )}
            {match.scheduledAt && (
              <Typography variant="caption" color="text.secondary">
                🕐 {new Date(match.scheduledAt).toLocaleTimeString()}
              </Typography>
            )}
          </Stack>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {match.slotIndex !== null && (
            <Typography variant="caption" color="text.secondary">
              Slot {match.slotIndex + 1}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Score Entry Dialog */}
      {showActions && (
        <ScoreEntryDialog
          open={scoreDialogOpen}
          onClose={() => setScoreDialogOpen(false)}
          match={match}
          divisionId={match.divisionId}
        />
      )}
    </Card>
  );
};
