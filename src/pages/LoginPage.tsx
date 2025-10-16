import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '@/contexts/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, loading } = useAuth();

  // Check for error from OAuth callback
  const authError = searchParams.get('error');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = () => {
    login();
  };

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
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo/Branding */}
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Tournament Manager
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to manage tournaments
          </Typography>

          {/* Error Message */}
          {authError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {authError === 'auth_failed'
                ? 'Authentication failed. Please try again.'
                : 'An error occurred during login. Please try again.'}
            </Alert>
          )}

          {/* Google Sign In Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleLogin}
            disabled={loading}
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Sign in with Google
          </Button>

          {/* Features List */}
          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Admin Features:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              • Create and manage tournaments
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              • Add teams and generate schedules
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              • Enter scores and view live standings
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
