/**
 * Admin Context Bar Component
 * Shows current tournament/division context with quick actions
 */

import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Box, Paper, Typography, Chip, Stack, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CategoryIcon from '@mui/icons-material/Category';

interface ContextBarProps {
  tournamentId: number;
  tournamentName: string;
  divisionId?: number;
  divisionName?: string;
  showSettings?: boolean;
}

/**
 * Context Bar Component
 * Displays persistent context showing current tournament and division
 *
 * Features:
 * - Tournament name with icon
 * - Division name (if in division context)
 * - Quick link to settings
 * - Visual hierarchy with chips
 *
 * @example
 * <ContextBar
 *   tournamentId={1}
 *   tournamentName="Summer League 2025"
 *   divisionId={5}
 *   divisionName="Men's 4.0"
 *   showSettings
 * />
 */
export const ContextBar: FC<ContextBarProps> = ({
  tournamentId,
  tournamentName,
  divisionId,
  divisionName,
  showSettings = true
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: 2,
        bgcolor: 'primary.lighter',
        border: '1px solid',
        borderColor: 'primary.light',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Context Information */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Tournament Context */}
          <Chip
            icon={<EmojiEventsIcon />}
            label={tournamentName}
            component={Link}
            to={`/admin/tournaments/${tournamentId}`}
            clickable
            color="primary"
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white'
              }
            }}
          />

          {/* Division Context */}
          {divisionId && divisionName && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                /
              </Typography>
              <Chip
                icon={<CategoryIcon />}
                label={divisionName}
                component={Link}
                to={`/admin/tournaments/${tournamentId}/divisions/${divisionId}`}
                clickable
                color="secondary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'secondary.main',
                    color: 'white',
                    borderColor: 'secondary.main'
                  }
                }}
              />
            </>
          )}
        </Stack>

        {/* Right: Quick Settings Link */}
        {showSettings && (
          <IconButton
            component={Link}
            to={`/admin/tournaments/${tournamentId}/settings`}
            size="small"
            title="Tournament Settings"
            sx={{
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.light'
              }
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
};
