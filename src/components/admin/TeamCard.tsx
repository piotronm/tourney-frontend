import type { FC } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Team } from '@/types/team';

interface TeamCardProps {
  team: Team;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

/**
 * Team card component
 * Displays team summary with optional action buttons
 *
 * Features:
 * - Shows team name
 * - Shows pool assignment and seed
 * - Edit/Delete actions (optional)
 * - Responsive layout
 */
export const TeamCard: FC<TeamCardProps> = ({
  team,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {team.name}
            </Typography>

            {/* Pool Assignment */}
            {team.poolName ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  label={team.poolName}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {team.poolSeed && (
                  <Typography variant="body2" color="text.secondary">
                    Seed: {team.poolSeed}
                  </Typography>
                )}
              </Box>
            ) : (
              <Chip
                label="Unassigned"
                size="small"
                color="default"
                variant="outlined"
              />
            )}
          </Box>

          {/* Actions */}
          {showActions && (
            <Box>
              {onEdit && (
                <IconButton
                  size="small"
                  onClick={onEdit}
                  title="Edit team"
                >
                  <EditIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={onDelete}
                  title="Delete team"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
