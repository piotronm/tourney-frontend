import type { FC } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import BadgeIcon from '@mui/icons-material/Badge';
import WarningIcon from '@mui/icons-material/Warning';
import type { Player } from '@/types/player';

interface PlayerCardProps {
  player: Player;
  onEdit: (id: number) => void;
  onDelete: (player: Player) => void;
}

/**
 * Player card component - Redesigned
 * Displays ALL player information with consistent layout
 *
 * Features:
 * - Always shows all fields (even if missing)
 * - "Not provided" for missing data
 * - Incomplete profile indicator
 * - Consistent card height
 * - Better visual hierarchy with dividers
 * - Edit and Delete buttons
 * - Hover effect
 */
export const PlayerCard: FC<PlayerCardProps> = ({
  player,
  onEdit,
  onDelete,
}) => {
  // Check if profile is incomplete (missing key information)
  // Phone is truly optional and doesn't affect incomplete status
  const isIncomplete = !player.email || !player.duprId || !player.duprRating;

  // Format created date safely
  const formattedDate = (() => {
    try {
      if (!player.createdAt) return 'Unknown';
      const date = new Date(player.createdAt);
      if (isNaN(date.getTime())) return 'Unknown';
      return date.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  })();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header: Name + Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {player.firstName} {player.lastName}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(player.id)}
              title="Edit player"
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(player)}
              title="Delete player"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Incomplete Badge + ID on separate row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {isIncomplete && (
            <Chip
              icon={<WarningIcon />}
              label="Incomplete"
              size="small"
              color="warning"
            />
          )}
          <Typography variant="caption" color="text.secondary">
            ID: {player.id}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Contact Information */}
        <Stack spacing={1.5}>
          {/* Email */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ flex: 1 }}>
              <strong>Email:</strong>{' '}
              {player.email ? (
                <span>{player.email}</span>
              ) : (
                <span style={{ color: 'text.secondary', fontStyle: 'italic' }}>Not provided</span>
              )}
            </Typography>
          </Box>

          {/* Phone */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ flex: 1 }}>
              <strong>Phone:</strong>{' '}
              {player.phone ? (
                <span>{player.phone}</span>
              ) : (
                <span style={{ color: 'text.secondary', fontStyle: 'italic' }}>Not provided</span>
              )}
            </Typography>
          </Box>

          <Divider />

          {/* DUPR ID */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BadgeIcon fontSize="small" color="action" />
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" component="span">
                <strong>DUPR ID:</strong>
              </Typography>
              {player.duprId ? (
                <Chip label={player.duprId} size="small" variant="outlined" />
              ) : (
                <Typography variant="body2" component="span" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  Not provided
                </Typography>
              )}
            </Box>
          </Box>

          {/* DUPR Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon fontSize="small" color="action" />
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" component="span">
                <strong>DUPR Rating:</strong>
              </Typography>
              {player.duprRating ? (
                <Chip
                  label={player.duprRating.toFixed(2)}
                  size="small"
                  color="primary"
                  icon={<StarIcon />}
                />
              ) : (
                <Typography variant="body2" component="span" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  Not provided
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>

        {/* Footer: Created Date */}
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Added: {formattedDate}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
