import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EmojiEvents } from '@mui/icons-material';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <EmojiEvents sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Tournament Manager
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Browse tournaments, view standings, and track match results
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/divisions')}
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          Browse Tournaments
        </Button>
      </Paper>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom align="center">
          Features
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mt: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Live Standings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View real-time rankings and statistics
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Match Schedules
            </Typography>
            <Typography variant="body2" color="text.secondary">
              See all matches and scores
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Easy Search
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find tournaments quickly
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};
