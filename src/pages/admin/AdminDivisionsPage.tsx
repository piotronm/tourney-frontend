import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { FileDownload } from '@mui/icons-material';
import { useDivisions } from '@/hooks/admin/useDivisions';
import { useDeleteDivision } from '@/hooks/admin/useDeleteDivision';
import { useDebounce } from '@/hooks/useDebounce';
import { useExportDashboard } from '@/hooks/useExportDashboard';
import { DivisionCard } from '@/components/admin/DivisionCard';
import { DeleteDivisionDialog } from '@/components/admin/DeleteDivisionDialog';
import type { Division } from '@/types/division';

/**
 * Admin Divisions Page
 * Main page for managing tournament divisions
 *
 * Features:
 * - Search divisions by name (debounced)
 * - Pagination (20 per page)
 * - Create new division
 * - Edit existing divisions
 * - Delete divisions with confirmation
 * - Loading and error states
 * - Empty state with CTA
 */
export const AdminDivisionsPage = () => {
  const navigate = useNavigate();
  const { exportDashboard } = useExportDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Division | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, isLoading, isError, error } = useDivisions({
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
    navigate('/admin/divisions/new');
  };

  const handleEditClick = (divisionId: number) => {
    navigate(`/admin/divisions/${divisionId}/edit`);
  };

  const handleDeleteClick = (division: Division) => {
    setDeleteTarget(division);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    deleteDivision(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
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
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Manage Divisions
        </Typography>
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
