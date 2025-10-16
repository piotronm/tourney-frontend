import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Error } from '@mui/icons-material';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Error sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          404
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </Box>
    </Container>
  );
};
