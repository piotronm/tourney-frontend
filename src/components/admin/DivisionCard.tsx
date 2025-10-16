import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PoolIcon from '@mui/icons-material/Pool';
import type { Division } from '@/types/division';

interface DivisionCardProps {
  division: Division;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

/**
 * Division card component
 * Displays division summary with optional action buttons
 *
 * Features:
 * - Shows division name and stats
 * - Creation date
 * - Edit/Delete actions (optional)
 * - Navigate to standings/matches
 */
export const DivisionCard: FC<DivisionCardProps> = ({
  division,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {division.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {division.stats.teams} teams • {division.stats.pools} pools •{' '}
              {division.stats.matches} matches ({division.stats.completedMatches} completed)
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Created: {new Date(division.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          {showActions && (
            <Box>
              {onEdit && (
                <IconButton
                  size="small"
                  onClick={onEdit}
                  title="Edit division"
                >
                  <EditIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={onDelete}
                  title="Delete division"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => navigate(`/divisions/${division.id}/standings`)}
        >
          View Standings
        </Button>
        <Button
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => navigate(`/divisions/${division.id}/matches`)}
        >
          View Matches
        </Button>
        <Button
          size="small"
          onClick={() => navigate(`/admin/divisions/${division.id}/teams`)}
        >
          Manage Teams
        </Button>
        <Button
          size="small"
          startIcon={<PoolIcon />}
          onClick={() => navigate(`/admin/divisions/${division.id}/pools`)}
        >
          Manage Pools
        </Button>
      </CardActions>
    </Card>
  );
};
