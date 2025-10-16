import { Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import type { Match } from '@/api/types';

interface Props {
  match: Match;
}

export const MatchCard = ({ match }: Props) => {
  const isCompleted = match.status === 'completed';
  const isBye = !match.teamBName;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Round {match.roundNumber} • Match {match.matchNumber}
          </Typography>
          {match.poolName && (
            <Typography variant="caption" color="text.secondary">
              {match.poolName}
            </Typography>
          )}
        </Box>

        {/* Team A */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            bgcolor: 'grey.50',
            borderRadius: 1,
            mb: 1,
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            {match.teamAName}
          </Typography>
          {isCompleted && (
            <Typography variant="h5" fontWeight="bold" color="primary">
              {match.scoreA}
            </Typography>
          )}
        </Box>

        {/* VS or BYE */}
        <Box sx={{ textAlign: 'center', my: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {isBye ? 'BYE' : 'VS'}
          </Typography>
        </Box>

        {/* Team B */}
        {!isBye && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1.5,
              bgcolor: 'grey.50',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {match.teamBName}
            </Typography>
            {isCompleted && (
              <Typography variant="h5" fontWeight="bold" color="primary">
                {match.scoreB}
              </Typography>
            )}
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={isCompleted ? 'Completed' : 'Pending'}
            color={isCompleted ? 'success' : 'warning'}
            size="small"
          />
          {match.slotIndex !== null && (
            <Typography variant="caption" color="text.secondary">
              Slot {match.slotIndex + 1}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
