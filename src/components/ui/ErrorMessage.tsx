import { Box, Typography, Button, Alert } from '@mui/material';
import { ErrorOutline as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorMessageProps {
  message?: string;
  error?: Error;
  onRetry?: (options?: any) => void | Promise<any>;
}

export const ErrorMessage = ({
  message,
  error,
  onRetry,
}: ErrorMessageProps) => {
  const displayMessage = message || error?.message || 'An error occurred. Please try again.';
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 3,
        padding: 3,
      }}
    >
      <Alert
        severity="error"
        icon={<ErrorIcon fontSize="large" />}
        sx={{
          maxWidth: '600px',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">{displayMessage}</Typography>
      </Alert>

      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </Box>
  );
};
