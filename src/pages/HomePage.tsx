/**
 * HomePage - Landing page with tournament browsing
 * UPDATED: Phase 3 - Now links to /tournaments instead of /divisions
 */

import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EmojiEvents } from '@mui/icons-material';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
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
          Browse tournaments, view live standings, and track match results
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/tournaments')}
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
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Features
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 3,
            mt: 3,
          }}
        >
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Live Standings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View real-time rankings and statistics for all divisions
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Match Schedules
            </Typography>
            <Typography variant="body2" color="text.secondary">
              See all matches, scores, and upcoming games
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Easy Navigation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Browse tournaments and find divisions quickly
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};
