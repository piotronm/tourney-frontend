import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Button,
  Container,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useMatches } from '@/hooks/useMatches';
import { usePools } from '@/hooks/admin/usePools';
import { useDivision } from '@/hooks/useDivision';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { MatchCard } from '@/components/matches/MatchCard';

export const DivisionMatchesPage = () => {
  const { id: divisionId } = useParams<{ id: string }>();
  const parsedDivisionId = parseInt(divisionId!, 10);

  const { data: division, isLoading: divisionLoading } = useDivision(parsedDivisionId);
  const { data: pools } = usePools(parsedDivisionId);

  const [selectedPoolId, setSelectedPoolId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const {
    data: matchesData,
    isLoading: matchesLoading,
    error,
    refetch,
  } = useMatches(parsedDivisionId, {
    poolId: selectedPoolId === 'all' ? undefined : Number(selectedPoolId),
    status: selectedStatus === 'all' ? undefined : (selectedStatus as 'pending' | 'completed'),
  });

  // Loading states
  if (divisionLoading || matchesLoading) {
    return <Loading />;
  }

  // Error states
  if (error) {
    return (
      <Container maxWidth="lg">
        <ErrorMessage message="Failed to load matches" />
      </Container>
    );
  }

  if (!division) {
    return (
      <Container maxWidth="lg">
        <ErrorMessage message="Division not found" />
      </Container>
    );
  }

  // Extract matches from response (handles envelope pattern)
  const matches = matchesData?.data || [];

  // Group matches by pool
  const matchesByPool = matches.reduce((acc, match) => {
    const poolName = match.poolName || 'No Pool';
    if (!acc[poolName]) acc[poolName] = [];
    acc[poolName].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Typography variant="h4" fontWeight="bold">
            Manage Matches
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {division.name}
          </Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Pool</InputLabel>
          <Select
            value={selectedPoolId}
            label="Pool"
            onChange={(e) => setSelectedPoolId(e.target.value)}
          >
            <MenuItem value="all">All Pools</MenuItem>
            {pools?.map((pool) => (
              <MenuItem key={pool.id} value={pool.id.toString()}>
                {pool.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <MenuItem value="all">All Matches</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ flex: 1 }} />

        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
          Total: {matches.length} matches
        </Typography>
      </Stack>

      {/* Empty State */}
      {matches.length === 0 && (
        <EmptyState
          title="No matches found"
          description={
            selectedPoolId !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Generate matches from the Pools page to create a schedule'
          }
        />
      )}

      {/* Matches List - Grouped by Pool */}
      {Object.entries(matchesByPool).map(([poolName, poolMatches]) => (
        <Box key={poolName} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {poolName} ({poolMatches.length} matches)
          </Typography>
          <Stack spacing={2}>
            {poolMatches.map((match) => (
              <MatchCard key={match.id} match={match} showActions />
            ))}
          </Stack>
        </Box>
      ))}
    </Container>
  );
};
