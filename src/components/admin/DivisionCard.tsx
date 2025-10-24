import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PoolIcon from '@mui/icons-material/Pool';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupsIcon from '@mui/icons-material/Groups';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import type { Division } from '@/types/division';
import { StatusBadge, getTournamentStatus } from '@/components/ui/StatusBadge';
import { MatchProgressBar } from '@/components/ui/MatchProgressBar';

interface DivisionCardProps {
  division: Division;
  tournamentId?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

/**
 * Division card component
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Displays division summary with optional action buttons
 *
 * Features:
 * - Shows division name and stats
 * - Creation date
 * - Edit/Delete actions (optional)
 * - Navigate to standings/matches with tournament context
 * - Status badge and progress indicator
 */
export const DivisionCard: FC<DivisionCardProps> = ({
  division,
  tournamentId,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const status = getTournamentStatus(division);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6">
                {division.name}
              </Typography>
              <StatusBadge status={status} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {division.stats.registeredPlayers || 0} players • {division.stats.teams} teams • {division.stats.pools} pools •{' '}
              {division.stats.matches} matches
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              Created: {new Date(division.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          {showActions && (
            <Box>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                title="More actions"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate(`/tournaments/${tournamentId}/divisions/${division.id}/standings`);
                  }}
                >
                  <ListItemIcon>
                    <VisibilityIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>View Standings</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate(`/admin/tournaments/${tournamentId}/divisions/${division.id}/matches`);
                  }}
                >
                  <ListItemIcon>
                    <SportsTennisIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>View Matches</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate(`/admin/tournaments/${tournamentId}/divisions/${division.id}/teams`);
                  }}
                >
                  <ListItemIcon>
                    <GroupsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Manage Teams</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate(`/admin/tournaments/${tournamentId}/divisions/${division.id}/pools`);
                  }}
                >
                  <ListItemIcon>
                    <PoolIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Manage Pools</ListItemText>
                </MenuItem>
                {onEdit && (
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      onEdit();
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit Division</ListItemText>
                  </MenuItem>
                )}
                {onDelete && (
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      onDelete();
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete Division</ListItemText>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </Box>

        {/* Progress Bar */}
        <MatchProgressBar
          completed={division.stats.completedMatches}
          total={division.stats.matches}
        />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${division.id}`)}
        >
          Manage
        </Button>
      </CardActions>
    </Card>
  );
};
