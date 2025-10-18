/**
 * DivisionsPage - List all divisions within a tournament
 * UPDATED: Phase 3 - Now requires tournamentId from route params
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Grid,
  Box,
  Pagination,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTournament } from '@/hooks/useTournament';
import { useDivisions } from '@/hooks/useDivisions';
import { useDebounce } from '@/hooks/useDebounce';
import { DivisionCard } from '@/components/divisions/DivisionCard';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { PAGINATION } from '@/utils/constants';

export const DivisionsPage = () => {
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const tid = Number(tournamentId);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const limit = PAGINATION.DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  // Fetch tournament info for page title
  const { data: tournament } = useTournament(tid);

  // Fetch divisions for this tournament
  const { data, isLoading, error, refetch } = useDivisions(tid, {
    limit,
    offset,
    search: debouncedSearch,
  });

  if (isLoading) {
    return <Loading message="Loading divisions..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage error={error} onRetry={refetch} />
      </Container>
    );
  }

  if (!data) {
    return null;
  }

  const { data: divisions, meta } = data;
  const totalPages = Math.ceil(meta.total / limit);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {tournament ? `${tournament.name} - Divisions` : 'Divisions'}
      </Typography>

      <TextField
        fullWidth
        placeholder="Search divisions..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        sx={{ mb: 4, maxWidth: 600 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {divisions.length === 0 ? (
        <EmptyState
          message={
            search
              ? 'No divisions found matching your search'
              : 'No divisions in this tournament yet'
          }
        />
      ) : (
        <>
          <Grid container spacing={3}>
            {divisions.map((division) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={division.id}>
                <Box
                  onClick={() =>
                    navigate(`/tournaments/${tid}/divisions/${division.id}`)
                  }
                  sx={{ cursor: 'pointer' }}
                >
                  <DivisionCard division={division} tournamentId={tid} />
                </Box>
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
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};
