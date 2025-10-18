/**
 * StandingsPage - Display division standings
 * UPDATED: Phase 3 - Now requires tournamentId from route params
 */

import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useStandings } from '@/hooks/useStandings';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';

export const StandingsPage = () => {
  const { tournamentId, id } = useParams<{ tournamentId: string; id: string }>();

  const tid = Number(tournamentId);
  const did = Number(id);

  const { data, isLoading, error, refetch } = useStandings(tid, did);

  if (isLoading) {
    return <Loading message="Loading standings..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data) {
    return null;
  }

  if (data.pools.length === 0) {
    return <EmptyState message="No standings available yet" />;
  }

  return (
    <Box>
      <StandingsTable standings={data.pools} />
    </Box>
  );
};
