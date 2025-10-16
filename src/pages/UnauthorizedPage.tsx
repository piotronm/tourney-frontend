import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          p: 4,
        }}
      >
        <BlockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You don't have permission to access this page. Please contact an administrator if you
          believe this is an error.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Paper>
    </Box>
  );
};
