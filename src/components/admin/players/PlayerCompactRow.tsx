import { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Checkbox,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Player } from '@/types/player';
import { getInitials } from '@/utils/formatters';

interface PlayerCompactRowProps {
  player: Player;
  onDelete: (player: Player) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (playerId: number) => void;
}

/**
 * PlayerCompactRow Component
 *
 * Compact horizontal row display for player information
 * Replaces the large card layout to show 6-7x more players per screen
 *
 * Features:
 * - Horizontal layout (~70px tall vs ~450px card)
 * - All player data visible in single row
 * - Selection checkbox for bulk operations
 * - Hover effects and visual feedback
 * - Edit/Delete actions inline
 * - Incomplete profile indicator
 */
export function PlayerCompactRow({
  player,
  onDelete,
  selectionMode = false,
  isSelected = false,
  onToggleSelect,
}: PlayerCompactRowProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Check if profile is incomplete
  const isIncomplete =
    !player.email ||
    !player.duprId ||
    (player.doublesRating === null && player.singlesRating === null);

  const handleEdit = () => {
    navigate(`/admin/players/${player.id}/edit`);
  };

  const handleDelete = () => {
    onDelete(player);
  };

  const handleCheckboxChange = () => {
    if (onToggleSelect) {
      onToggleSelect(player.id);
    }
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
        minHeight: 64,
        border: '1px solid',
        borderColor: isHovered ? 'primary.main' : 'divider',
        borderRadius: 1,
        bgcolor: isSelected ? 'action.selected' : isHovered ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 1,
        },
      }}
    >
      {/* Checkbox (Selection Mode) */}
      {selectionMode && (
        <Checkbox
          checked={isSelected}
          onChange={handleCheckboxChange}
          size="small"
          sx={{ p: 0 }}
        />
      )}

      {/* Avatar + Name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 200, flexShrink: 0 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.75rem',
            bgcolor: 'primary.main',
            flexShrink: 0,
          }}
        >
          {getInitials(player.name)}
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {player.name}
            </Typography>

            {/* Incomplete Warning */}
            {isIncomplete && (
              <Tooltip title="Incomplete profile - missing email, DUPR ID, or ratings">
                <WarningIcon sx={{ fontSize: 16, color: 'warning.main', flexShrink: 0 }} />
              </Tooltip>
            )}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: '0.7rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            ID: {player.id}
          </Typography>
        </Box>
      </Box>

      {/* Email */}
      <Box sx={{ width: 200, flexShrink: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {player.email || (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem', fontStyle: 'italic' }}
            >
              Not provided
            </Typography>
          )}
        </Typography>
      </Box>

      {/* Phone */}
      <Box sx={{ width: 130, flexShrink: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {player.phone || (
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem', fontStyle: 'italic' }}
            >
              Not provided
            </Typography>
          )}
        </Typography>
      </Box>

      {/* DUPR ID */}
      <Box sx={{ width: 100, flexShrink: 0 }}>
        {player.duprId ? (
          <Chip
            label={player.duprId}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            Not provided
          </Typography>
        )}
      </Box>

      {/* Doubles Rating */}
      <Box sx={{ width: 80, flexShrink: 0, textAlign: 'center' }}>
        {player.doublesRating !== null ? (
          <Chip
            label={player.doublesRating.toFixed(2)}
            size="small"
            color="primary"
            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            —
          </Typography>
        )}
      </Box>

      {/* Singles Rating */}
      <Box sx={{ width: 80, flexShrink: 0, textAlign: 'center' }}>
        {player.singlesRating !== null ? (
          <Chip
            label={player.singlesRating.toFixed(2)}
            size="small"
            color="secondary"
            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            —
          </Typography>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 0.5, width: 80, flexShrink: 0, justifyContent: 'flex-end' }}>
        <Tooltip title="Edit player">
          <IconButton
            size="small"
            onClick={handleEdit}
            sx={{ width: 32, height: 32 }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete player">
          <IconButton
            size="small"
            color="error"
            onClick={handleDelete}
            sx={{ width: 32, height: 32 }}
          >
            <DeleteIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
