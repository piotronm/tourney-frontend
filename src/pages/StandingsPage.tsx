import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useStandings } from '@/hooks/useStandings';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';

export const StandingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const divisionId = id ? parseInt(id, 10) : undefined;

  const { data, isLoading, error, refetch } = useStandings(divisionId);

  if (isLoading) return <Loading message="Loading standings..." />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data) return null;

  if (data.pools.length === 0) {
    return <EmptyState message="No standings available yet" />;
  }

  return (
    <Box>
      <StandingsTable standings={data.pools} />
    </Box>
  );
};
