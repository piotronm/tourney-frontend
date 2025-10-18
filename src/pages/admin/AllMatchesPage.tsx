import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EnhancedEmptyState } from '@/components/ui/EnhancedEmptyState';

export function AllMatchesPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <EnhancedEmptyState
          emoji="🚧"
          title="All Matches View Coming Soon"
          description="We're working on a global matches view across all divisions. For now, you can view and manage matches within each specific division."
          actionLabel="Go to Divisions"
          onAction={() => navigate('/admin/divisions')}
          secondaryActionLabel="Back to Dashboard"
          onSecondaryAction={() => navigate('/admin/dashboard')}
        />
      </Box>
    </Container>
  );
}
