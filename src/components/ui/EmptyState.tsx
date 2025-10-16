import { Box, Typography } from '@mui/material';
import { InboxOutlined as InboxIcon } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message?: string;
}

export const EmptyState = ({
  icon = <InboxIcon sx={{ fontSize: 80, color: 'text.disabled' }} />,
  title = 'No data available',
  message = 'There is nothing to display at the moment.',
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 2,
        padding: 3,
      }}
    >
      {icon}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" textAlign="center">
        {message}
      </Typography>
    </Box>
  );
};
