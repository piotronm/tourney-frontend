/**
 * TournamentCard - Clickable card component for tournament list
 * Phase 3: Tournament hierarchy component
 */

import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Groups as TeamsIcon,
  SportsSoccer as MatchesIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import type { Tournament } from '@/api/types';

interface TournamentCardProps {
  tournament: Tournament;
}

export const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const getStatusColor = (
    status: string
  ): 'success' | 'info' | 'warning' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'archived':
        return 'warning';
      case 'draft':
      default:
        return 'default';
    }
  };

  return (
    <Card
      component={Link}
      to={`/tournaments/${tournament.id}`}
      sx={{
        textDecoration: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          height: '100%',
        }}
      >
        <CardContent sx={{ width: '100%', flexGrow: 1 }}>
          {/* Header with name and status */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{
                flexGrow: 1,
                lineHeight: 1.3,
              }}
            >
              {tournament.name}
            </Typography>
            <Chip
              label={tournament.status.toUpperCase()}
              color={getStatusColor(tournament.status)}
              size="small"
            />
          </Box>

          {/* Description */}
          {tournament.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {tournament.description}
            </Typography>
          )}

          {/* Stats */}
          {tournament.stats && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 'auto', pt: 2 }}
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                icon={<TrophyIcon />}
                label={`${tournament.stats.divisions} ${tournament.stats.divisions === 1 ? 'Division' : 'Divisions'}`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<TeamsIcon />}
                label={`${tournament.stats.teams} ${tournament.stats.teams === 1 ? 'Team' : 'Teams'}`}
                size="small"
                variant="outlined"
              />
              {tournament.stats.matches > 0 && (
                <Chip
                  icon={<MatchesIcon />}
                  label={`${tournament.stats.matches} ${tournament.stats.matches === 1 ? 'Match' : 'Matches'}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
