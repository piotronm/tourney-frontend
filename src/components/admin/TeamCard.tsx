import type { FC } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import type { Team } from '@/types/team';

interface TeamCardProps {
  team: Team;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

/**
 * Team card component
 * Displays team summary with player roster and action buttons
 *
 * Features (Day 2 Enhanced):
 * - Shows team name and source badge
 * - Displays player roster with names and DUPR ratings
 * - Shows pool assignment and seed
 * - Team statistics (wins, losses, points)
 * - Edit/Delete actions (optional)
 */
export const TeamCard: FC<TeamCardProps> = ({
  team,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 6,
          '& .team-card-actions': {
            opacity: 1,
            visibility: 'visible'
          }
        }
      }}
    >
      <CardContent>
        {/* Team Name Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, flex: 1 }}>
            {team.name}
          </Typography>

          {/* Source Badge */}
          {team.source === 'registration' && (
            <Chip
              icon={<EmojiEventsIcon sx={{ fontSize: 16 }} />}
              label="Registered"
              size="small"
              color="success"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        {/* Player Roster Section */}
        {team.players && team.players.length > 0 ? (
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              ROSTER
            </Typography>
            {team.players.map((player) => (
              <Box
                key={player.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                {/* Player Avatar */}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: player.position === 1 ? 'primary.main' : 'secondary.main',
                    fontSize: '0.875rem'
                  }}
                >
                  {player.firstName?.[0] || '?'}{player.lastName?.[0] || '?'}
                </Avatar>

                {/* Player Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {player.firstName} {player.lastName}
                  </Typography>
                  {player.duprRating !== null && (
                    <Typography variant="caption" color="text.secondary">
                      DUPR: {player.duprRating.toFixed(2)}
                    </Typography>
                  )}
                </Box>

                {/* Position Badge */}
                <Chip
                  label={`P${player.position}`}
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 40 }}
                />
              </Box>
            ))}
          </Stack>
        ) : (
          /* No Players Warning */
          <Box
            sx={{
              p: 2,
              mb: 2,
              bgcolor: 'warning.lighter',
              border: '1px solid',
              borderColor: 'warning.main',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <WarningIcon color="warning" sx={{ fontSize: 20 }} />
            <Typography variant="body2" color="warning.dark">
              No players linked to this team
            </Typography>
          </Box>
        )}

        {/* Pool Assignment */}
        {team.poolName && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Pool: ${team.poolName}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
            {team.poolSeed && (
              <Chip
                label={`Seed: ${team.poolSeed}`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}

        {/* Team Statistics */}
        <Box sx={{ display: 'flex', gap: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">W-L</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {team.wins}-{team.losses}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">PF-PA</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {team.pointsFor}-{team.pointsAgainst}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Matches</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {team.matchesPlayed}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons - Hidden until hover */}
        {showActions && (onEdit || onDelete) && (
          <Box
            className="team-card-actions"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              opacity: 0,
              visibility: 'hidden',
              transition: 'opacity 0.2s, visibility 0.2s',
              display: 'flex',
              gap: 0.5,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 2,
              p: 0.5
            }}
          >
            {onEdit && (
              <IconButton
                size="small"
                onClick={onEdit}
                title="Edit team"
                sx={{
                  bgcolor: 'primary.lighter',
                  '&:hover': { bgcolor: 'primary.light' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                color="error"
                onClick={onDelete}
                title="Delete team"
                sx={{
                  bgcolor: 'error.lighter',
                  '&:hover': { bgcolor: 'error.light' }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
