import { Box, Typography, Button, Paper } from '@mui/material';

interface EnhancedEmptyStateProps {
  icon?: React.ReactNode;
  emoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  steps?: string[];
}

export function EnhancedEmptyState({
  icon,
  emoji = '📋',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  steps,
}: EnhancedEmptyStateProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        textAlign: 'center',
        py: 8,
        px: 4,
        backgroundColor: 'grey.50',
        borderRadius: 2,
      }}
    >
      {icon || (
        <Typography sx={{ fontSize: 64, mb: 2 }}>
          {emoji}
        </Typography>
      )}

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
        {description}
      </Typography>

      {steps && steps.length > 0 && (
        <Box sx={{ mb: 3, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
            How to get started:
          </Typography>
          {steps.map((step, index) => (
            <Typography
              key={index}
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}
            >
              <Box component="span" sx={{ fontWeight: 600, minWidth: 24 }}>
                {index + 1}.
              </Box>
              <span>{step}</span>
            </Typography>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        {actionLabel && onAction && (
          <Button
            variant="contained"
            size="large"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button
            variant="outlined"
            size="large"
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </Button>
        )}
      </Box>
    </Paper>
  );
}
