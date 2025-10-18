import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EnhancedEmptyState } from '@/components/ui/EnhancedEmptyState';

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <EnhancedEmptyState
          emoji="⚙️"
          title="Settings Coming Soon"
          description="We're working on application settings. This will include user preferences, theme customization, notification settings, and more."
          actionLabel="Back to Dashboard"
          onAction={() => navigate('/admin/dashboard')}
        />
      </Box>
    </Container>
  );
}
