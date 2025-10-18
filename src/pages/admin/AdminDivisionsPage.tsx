import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { FileDownload, ArrowBack } from '@mui/icons-material';
import { useDivisions } from '@/hooks/admin/useDivisions';
import { useDeleteDivision } from '@/hooks/admin/useDeleteDivision';
import { useTournament } from '@/hooks/admin/useTournament';
import { useDebounce } from '@/hooks/useDebounce';
import { useExportDashboard } from '@/hooks/useExportDashboard';
import { DivisionCard } from '@/components/admin/DivisionCard';
import { DeleteDivisionDialog } from '@/components/admin/DeleteDivisionDialog';
import type { Division } from '@/types/division';

/**
 * Admin Divisions Page
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Main page for managing divisions within a specific tournament
 *
 * Features:
 * - Search divisions by name (debounced)
 * - Pagination (20 per page)
 * - Create new division in tournament
 * - Edit existing divisions
 * - Delete divisions with confirmation
 * - Loading and error states
 * - Empty state with CTA
 * - Tournament context breadcrumbs
 */
export const AdminDivisionsPage = () => {
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const { exportDashboard } = useExportDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Division | null>(null);

  const parsedTournamentId = tournamentId ? parseInt(tournamentId, 10) : undefined;

  // Fetch tournament info for breadcrumbs
  const { data: tournament } = useTournament(parsedTournamentId);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, isLoading, isError, error } = useDivisions(parsedTournamentId, {
    limit,
    offset,
    search: debouncedSearch || undefined,
  });

  const { mutate: deleteDivision, isPending: isDeleting } = useDeleteDivision();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateClick = () => {
    navigate(`/admin/tournaments/${tournamentId}/divisions/new`);
  };

  const handleEditClick = (divisionId: number) => {
    navigate(`/admin/tournaments/${tournamentId}/divisions/${divisionId}/edit`);
  };

  const handleDeleteClick = (division: Division) => {
    setDeleteTarget(division);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget || !parsedTournamentId) return;

    deleteDivision(
      { tournamentId: parsedTournamentId, divisionId: deleteTarget.id },
      {
        onSuccess: () => {
          setDeleteTarget(null);
        },
      }
    );
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleExport = () => {
    const divisions = data?.data || [];
    exportDashboard(divisions);
  };

  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;
  const divisions = data?.data || [];

  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/admin/tournaments')}
            sx={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            Tournaments
          </Link>
          {tournament && (
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate(`/admin/tournaments/${tournamentId}`)}
              sx={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              {tournament.name}
            </Link>
          )}
          <Typography color="text.primary">Divisions</Typography>
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Manage Divisions
          </Typography>
          {tournament && (
            <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
              {tournament.name}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {divisions.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExport}
            >
              Export
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            Create Division
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search divisions..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.message || 'Failed to load divisions. Please try again.'}
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !isError && divisions.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          {searchQuery ? (
            <>
              <Typography variant="h6" gutterBottom>
                No divisions found
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                No divisions match "{searchQuery}"
              </Typography>
              <Button onClick={() => setSearchQuery('')} sx={{ mt: 2 }}>
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                No divisions yet
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Create your first tournament division to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateClick}
                sx={{ mt: 2 }}
              >
                Create First Division
              </Button>
            </>
          )}
        </Box>
      )}

      {/* Division List */}
      {!isLoading && !isError && divisions.length > 0 && (
        <>
          <Grid container spacing={3}>
            {divisions.map((division) => (
              <Grid item xs={12} sm={6} md={4} key={division.id}>
                <DivisionCard
                  division={division}
                  tournamentId={parsedTournamentId}
                  onEdit={() => handleEditClick(division.id)}
                  onDelete={() => handleDeleteClick(division)}
                  showActions
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDivisionDialog
        open={!!deleteTarget}
        division={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />
    </Container>
  );
};
