import { Box, Container, Typography, Link } from '@mui/material';
import { APP_NAME } from '@/utils/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {currentYear} {APP_NAME}. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Built with{' '}
          <Link
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            React
          </Link>
          {' and '}
          <Link
            href="https://mui.com"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            Material-UI
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};
