/**
 * MatchesPage - Display and filter division matches
 * UPDATED: Phase 3 - Now requires tournamentId from route params
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import { useMatches } from '@/hooks/useMatches';
import { useDivision } from '@/hooks/useDivision';
import { MatchCard } from '@/components/matches/MatchCard';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';

export const MatchesPage = () => {
  const { tournamentId, id } = useParams<{ tournamentId: string; id: string }>();

  const tid = Number(tournamentId);
  const did = Number(id);

  const [poolId, setPoolId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<'pending' | 'completed' | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);

  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: division } = useDivision(tid, did);
  const { data, isLoading, error, refetch } = useMatches(tid, did, {
    limit,
    offset,
    poolId,
    status,
  });

  if (isLoading) {
    return <Loading message="Loading matches..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data) {
    return null;
  }

  const { data: matches, meta } = data;
  const totalPages = Math.ceil(meta.total / limit);

  const handlePoolChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setPoolId(value === 'all' ? undefined : parseInt(value, 10));
    setPage(1);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setStatus(
      value === 'all' ? undefined : (value as 'pending' | 'completed')
    );
    setPage(1);
  };

  return (
    <Box>
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Pool</InputLabel>
          <Select
            value={poolId?.toString() || 'all'}
            label="Pool"
            onChange={handlePoolChange}
          >
            <MenuItem value="all">All Pools</MenuItem>
            {division?.pools.map((pool) => (
              <MenuItem key={pool.id} value={pool.id.toString()}>
                {pool.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status || 'all'}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="all">All Matches</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Matches */}
      {matches.length === 0 ? (
        <EmptyState message="No matches found with the selected filters" />
      ) : (
        <>
          <Grid container spacing={2}>
            {matches.map((match) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={match.id}>
                <MatchCard match={match} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
