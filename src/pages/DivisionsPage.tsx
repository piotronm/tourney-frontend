import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useDivisions } from '@/hooks/useDivisions';
import { useDebounce } from '@/hooks/useDebounce';
import { DivisionCard } from '@/components/divisions/DivisionCard';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { PAGINATION } from '@/utils/constants';

export const DivisionsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const limit = PAGINATION.DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  const { data, isLoading, error, refetch } = useDivisions({
    limit,
    offset,
    search: debouncedSearch,
  });

  if (isLoading) return <Loading message="Loading tournaments..." />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  const { data: divisions, meta } = data!;
  const totalPages = Math.ceil(meta.total / limit);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Tournaments
      </Typography>

      <TextField
        fullWidth
        placeholder="Search tournaments..."
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
          message={search ? 'No tournaments found matching your search' : 'No tournaments yet'}
        />
      ) : (
        <>
          <Grid container spacing={3}>
            {divisions.map((division) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={division.id}>
                <Box
                  onClick={() => navigate(`/divisions/${division.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <DivisionCard division={division} />
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
