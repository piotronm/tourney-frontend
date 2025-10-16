import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import {
  Groups as TeamsIcon,
  EmojiEvents as PoolsIcon,
  SportsSoccer as MatchesIcon,
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';
import type { Division } from '@/api/types';
import { formatDate } from '@/utils/formatters';

interface DivisionCardProps {
  division: Division;
  onClick?: (division: Division) => void;
}

export const DivisionCard = ({ division, onClick }: DivisionCardProps) => {
  const { name, createdAt, stats } = division;
  const completionPercentage =
    stats.matches > 0
      ? Math.round((stats.completedMatches / stats.matches) * 100)
      : 0;

  return (
    <Card>
      <CardActionArea onClick={() => onClick?.(division)}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            {name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Created {formatDate(createdAt)}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<TeamsIcon />}
              label={`${stats.teams} Teams`}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<PoolsIcon />}
              label={`${stats.pools} Pools`}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<MatchesIcon />}
              label={`${stats.matches} Matches`}
              size="small"
              variant="outlined"
            />
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CompletedIcon
              fontSize="small"
              color={completionPercentage === 100 ? 'success' : 'action'}
            />
            <Typography variant="body2" color="text.secondary">
              {stats.completedMatches} / {stats.matches} completed (
              {completionPercentage}%)
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
