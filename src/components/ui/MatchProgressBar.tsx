import { Box, LinearProgress, Typography } from '@mui/material';

interface MatchProgressBarProps {
  completed: number;
  total: number;
  showLabel?: boolean;
}

export function MatchProgressBar({ completed, total, showLabel = true }: MatchProgressBarProps) {
  if (total === 0) return null;

  const percentage = Math.round((completed / total) * 100);

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      {showLabel && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Match Progress
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {completed}/{total} ({percentage}%)
          </Typography>
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 1,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            borderRadius: 1,
          }
        }}
      />
    </Box>
  );
}
