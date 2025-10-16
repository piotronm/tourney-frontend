import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import UploadIcon from '@mui/icons-material/Upload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTeams } from '@/hooks/admin/useTeams';
import { useDeleteTeam } from '@/hooks/admin/useDeleteTeam';
import { useDivision } from '@/hooks/admin/useDivision';
import { useDebounce } from '@/hooks/useDebounce';
import { TeamCard } from '@/components/admin/TeamCard';
import { DeleteTeamDialog } from '@/components/admin/DeleteTeamDialog';
import { BulkImportTeamsDialog } from '@/components/admin/BulkImportTeamsDialog';
import { useBulkImportTeams } from '@/hooks/admin/useBulkImportTeams';
import type { Team, BulkImportTeam } from '@/types/team';

/**
 * Division Teams Page
 * Main page for managing teams within a division
 *
 * Features:
 * - List all teams in division
 * - Search teams by name
 * - Filter by pool
 * - Add single team
 * - Bulk import teams from CSV
 * - Edit/delete teams
 * - Pagination
 */
export const DivisionTeamsPage = () => {
  const { divisionId } = useParams<{ divisionId: string }>();
  const navigate = useNavigate();
  const parsedDivisionId = parseInt(divisionId!, 10);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const limit = 20;
  const offset = (page - 1) * limit;

  // Fetch division info
  const { data: division, isLoading: isDivisionLoading } = useDivision(parsedDivisionId);

  // Fetch teams
  const { data, isLoading, isError, error } = useTeams({
    divisionId: parsedDivisionId,
    limit,
    offset,
    search: debouncedSearch || undefined,
  });

  // Delete mutation
  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeam();

  // Bulk import mutation
  const { mutate: bulkImport, isPending: isImporting } = useBulkImportTeams();

  const teams = data?.data || [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddTeam = () => {
    navigate(`/admin/divisions/${divisionId}/teams/new`);
  };

  const handleEditTeam = (teamId: number) => {
    navigate(`/admin/divisions/${divisionId}/teams/${teamId}/edit`);
  };

  const handleDeleteClick = (team: Team) => {
    setDeleteTarget(team);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    deleteTeam(
      { divisionId: parsedDivisionId, teamId: deleteTarget.id },
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

  const handleImport = (teams: BulkImportTeam[]) => {
    bulkImport(
      { divisionId: parsedDivisionId, teams },
      {
        onSuccess: (result) => {
          // Only close dialog if no errors
          if (result.errors.length === 0) {
            setImportDialogOpen(false);
          }
          // If there are errors, keep dialog open so user can fix CSV
        },
      }
    );
  };

  if (isDivisionLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/admin/dashboard')}
        >
          Dashboard
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/admin/divisions')}
        >
          Divisions
        </Link>
        <Typography color="text.primary">{division?.name}</Typography>
        <Typography color="text.primary">Teams</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/divisions')}
        sx={{ mb: 2 }}
      >
        Back to Divisions
      </Button>

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Manage Teams
          </Typography>
          <Typography color="text.secondary">
            {division?.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setImportDialogOpen(true)}
          >
            Import CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTeam}
          >
            Add Team
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search teams..."
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
          {error?.message || 'Failed to load teams. Please try again.'}
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !isError && teams.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          {searchQuery ? (
            <>
              <Typography variant="h6" gutterBottom>
                No teams found
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                No teams match "{searchQuery}"
              </Typography>
              <Button onClick={() => setSearchQuery('')} sx={{ mt: 2 }}>
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                No teams yet
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Add teams individually or import from CSV
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddTeam}
                >
                  Add First Team
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => setImportDialogOpen(true)}
                >
                  Import from CSV
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Teams Grid */}
      {!isLoading && !isError && teams.length > 0 && (
        <>
          <Grid container spacing={2}>
            {teams.map((team) => (
              <Grid item xs={12} sm={6} md={4} key={team.id}>
                <TeamCard
                  team={team}
                  onEdit={() => handleEditTeam(team.id)}
                  onDelete={() => handleDeleteClick(team)}
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
      <DeleteTeamDialog
        open={!!deleteTarget}
        team={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />

      {/* Bulk Import Dialog */}
      <BulkImportTeamsDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImport}
        isImporting={isImporting}
      />
    </Container>
  );
};
