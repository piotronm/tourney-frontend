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
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import type { Match } from '@/api/types';

interface Props {
  match: Match;
  showActions?: boolean;
}

export const MatchCard = ({ match, showActions = false }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isCompleted = match.status === 'completed';
  const isBye = !match.teamBName;

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
  };

  // Status label mapping
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Final';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Scheduled';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'flex-start' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {match.poolName && (
              <Chip label={match.poolName} size="small" color="primary" />
            )}
            <Typography variant="caption" color="text.secondary">
              Round {match.roundNumber} • Match {match.matchNumber}
            </Typography>
            <Chip
              label={getStatusLabel(match.status)}
              size="small"
              color={getStatusColor(match.status)}
            />
          </Stack>

          {/* Admin Actions Menu */}
          {showActions && (
            <>
              <IconButton onClick={handleClick} size="small">
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Edit Match</MenuItem>
                <MenuItem onClick={handleClose}>Enter Score</MenuItem>
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
    </Card>
  );
};
