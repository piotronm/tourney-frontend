/**
 * Recent Tournaments Widget
 * Shows recently viewed tournaments for quick access
 */

import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ClearIcon from '@mui/icons-material/Clear';
import { useRecentTournaments } from '@/hooks/admin/useRecentTournaments';
import { formatDistanceToNow } from 'date-fns';

/**
 * Recent Tournaments Widget Component
 * Displays list of recently viewed tournaments
 *
 * Features:
 * - Shows last 5 tournaments
 * - Displays time since last view
 * - One-click navigation
 * - Clear all button
 * - Empty state
 *
 * Usage:
 * - Add to Dashboard page
 * - Call addRecentTournament() when viewing a tournament
 */
export const RecentTournaments: FC = () => {
  const navigate = useNavigate();
  const { recentTournaments, clearRecentTournaments } = useRecentTournaments();

  const handleTournamentClick = (id: number) => {
    navigate(`/admin/tournaments/${id}`);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all recent tournaments?')) {
      clearRecentTournaments();
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={<AccessTimeIcon color="primary" />}
        title="Recent Tournaments"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        action={
          recentTournaments.length > 0 && (
            <IconButton
              size="small"
              onClick={handleClearAll}
              title="Clear all"
              sx={{ color: 'text.secondary' }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {recentTournaments.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: 'center',
              color: 'text.secondary'
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
            <Typography variant="body2">
              No recent tournaments
            </Typography>
            <Typography variant="caption">
              Tournaments you visit will appear here
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {recentTournaments.map((tournament, index) => {
              const timeAgo = formatDistanceToNow(new Date(tournament.lastViewedAt), {
                addSuffix: true
              });

              return (
                <ListItem
                  key={tournament.id}
                  disablePadding
                  divider={index < recentTournaments.length - 1}
                >
                  <ListItemButton
                    onClick={() => handleTournamentClick(tournament.id)}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'primary.lighter'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {tournament.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={timeAgo}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
