import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import SortIcon from '@mui/icons-material/Sort';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import { usePlayers } from '@/hooks/admin/usePlayers';
import { useDeletePlayer, useDeleteAllPlayers } from '@/hooks/admin/usePlayers';
import { useExportPlayers } from '@/hooks/admin/useExportPlayers';
import { useBulkDeletePlayers } from '@/hooks/admin/useBulkDeletePlayers';
import { useDebounce } from '@/hooks/useDebounce';
import { PlayerCompactRow } from '@/components/admin/players/PlayerCompactRow';
import { DeletePlayerDialog } from '@/components/admin/players/DeletePlayerDialog';
import { DeleteAllPlayersDialog } from '@/components/admin/players/DeleteAllPlayersDialog';
import { CSVImportModal } from '@/components/admin/players/CSVImportModal';
import type { Player } from '@/types/player';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

/**
 * Players List Page
 * Main page for managing the player database
 *
 * Features:
 * - Search players by name or email (debounced)
 * - Pagination (20 per page)
 * - Create new player
 * - Edit existing players
 * - Delete players with confirmation
 * - Loading and error states
 * - Empty state with CTA
 */
export const PlayersListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, isLoading, isError, error } = usePlayers({
    limit,
    offset,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  });

  const { mutate: deletePlayer, isPending: isDeleting } = useDeletePlayer();
  const { mutate: exportPlayers, isPending: isExporting } = useExportPlayers();
  const { mutate: bulkDeletePlayers, isPending: isBulkDeleting } = useBulkDeletePlayers();
  const { mutate: deleteAllPlayers, isPending: isDeletingAll } = useDeleteAllPlayers();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateClick = () => {
    navigate('/admin/players/add');
  };

  const handleEditClick = (playerId: number) => {
    navigate(`/admin/players/${playerId}/edit`);
  };

  const handleDeleteClick = (player: Player) => {
    setDeleteTarget(player);
  };

  const handleDeleteConfirm = (id: number) => {
    deletePlayer(id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleExportClick = () => {
    exportPlayers();
  };

  const handleSortChange = (event: any) => {
    const value = event.target.value;
    const [newSortBy, newSortOrder] = value.split('-') as ['name' | 'rating' | 'date', 'asc' | 'desc'];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1); // Reset to first page on sort change
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedIds(new Set());
  };

  const handleToggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === players.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(players.map(p => p.id)));
    }
  };

  const handleBulkDeleteClick = () => {
    setShowBulkDeleteConfirm(true);
  };

  const handleBulkDeleteConfirm = () => {
    bulkDeletePlayers(Array.from(selectedIds), {
      onSuccess: () => {
        setSelectedIds(new Set());
        setShowBulkDeleteConfirm(false);
        setSelectionMode(false);
      },
    });
  };

  const handleBulkDeleteCancel = () => {
    setShowBulkDeleteConfirm(false);
  };

  const handleDeleteAll = () => {
    deleteAllPlayers(undefined, {
      onSuccess: () => {
        // Reset to first page after deletion
        setPage(1);
        // Clear any selections
        setSelectedIds(new Set());
        setSelectionMode(false);
      },
    });
  };

  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;
  const players = data?.data || [];

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Players
          </Typography>
          {selectionMode && selectedIds.size > 0 && (
            <Chip label={`${selectedIds.size} selected`} color="primary" />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selectionMode ? (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDeleteClick}
                disabled={selectedIds.size === 0 || isBulkDeleting}
              >
                {isBulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size}`}
              </Button>
              <Button
                variant="outlined"
                onClick={handleToggleSelectionMode}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={handleToggleSelectionMode}
                disabled={!players.length}
              >
                Select Multiple
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => setImportModalOpen(true)}
              >
                Import CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportClick}
                disabled={isExporting || !players.length}
              >
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateClick}
              >
                Add Player
              </Button>

              {/* Delete All Button - Development Tool */}
              {import.meta.env.DEV && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteAllDialogOpen(true)}
                  disabled={!data?.meta?.total || data.meta.total === 0 || isDeletingAll}
                  sx={{
                    borderColor: 'error.main',
                    '&:hover': {
                      borderColor: 'error.dark',
                      bgcolor: 'error.light',
                    },
                  }}
                >
                  Delete All ({data?.meta?.total || 0})
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Search Bar and Sort */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: selectionMode ? 2 : 0 }}>
          <TextField
            fullWidth
            placeholder="Search players by name or email..."
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
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={`${sortBy}-${sortOrder}`}
              label="Sort By"
              onChange={handleSortChange}
              startAdornment={<SortIcon sx={{ ml: 1, mr: -0.5 }} />}
            >
              <MenuItem value="name-asc">Name (A-Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z-A)</MenuItem>
              <MenuItem value="rating-asc">Rating (Low-High)</MenuItem>
              <MenuItem value="rating-desc">Rating (High-Low)</MenuItem>
              <MenuItem value="date-desc">Newest First</MenuItem>
              <MenuItem value="date-asc">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Select All Checkbox in Selection Mode */}
        {selectionMode && players.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
            <Checkbox
              checked={selectedIds.size === players.length && players.length > 0}
              indeterminate={selectedIds.size > 0 && selectedIds.size < players.length}
              onChange={handleSelectAll}
            />
            <Typography variant="body2" color="text.secondary">
              Select all on this page
            </Typography>
          </Box>
        )}
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
          {error?.message || 'Failed to load players. Please try again.'}
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !isError && players.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          {searchQuery ? (
            <>
              <Typography variant="h6" gutterBottom>
                No players found
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                No players match "{searchQuery}"
              </Typography>
              <Button onClick={() => setSearchQuery('')} sx={{ mt: 2 }}>
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                No players yet
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Add your first player to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateClick}
                sx={{ mt: 2 }}
              >
                Add First Player
              </Button>
            </>
          )}
        </Box>
      )}

      {/* Players List - Compact Rows */}
      {!isLoading && !isError && players.length > 0 && (
        <>
          {/* Column Headers */}
          {!selectionMode && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                bgcolor: 'action.hover',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Box sx={{ width: 200, flexShrink: 0 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  PLAYER
                </Typography>
              </Box>
              <Box sx={{ width: 200, flexShrink: 0 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  EMAIL
                </Typography>
              </Box>
              <Box sx={{ width: 130, flexShrink: 0 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  PHONE
                </Typography>
              </Box>
              <Box sx={{ width: 100, flexShrink: 0 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  DUPR ID
                </Typography>
              </Box>
              <Box sx={{ width: 80, flexShrink: 0, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  DOUBLES
                </Typography>
              </Box>
              <Box sx={{ width: 80, flexShrink: 0, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  SINGLES
                </Typography>
              </Box>
              <Box sx={{ width: 80, flexShrink: 0, textAlign: 'right' }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  ACTIONS
                </Typography>
              </Box>
            </Box>
          )}

          {/* Select All Row (Selection Mode) */}
          {selectionMode && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                bgcolor: 'action.selected',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Checkbox
                checked={players.length > 0 && selectedIds.size === players.length}
                indeterminate={selectedIds.size > 0 && selectedIds.size < players.length}
                onChange={handleSelectAll}
                size="small"
                sx={{ p: 0 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Select all on this page ({players.length} players)
              </Typography>
            </Box>
          )}

          {/* Player Rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {players.map((player) => (
              <PlayerCompactRow
                key={player.id}
                player={player}
                onDelete={handleDeleteClick}
                selectionMode={selectionMode}
                isSelected={selectedIds.has(player.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </Box>

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
      <DeletePlayerDialog
        open={!!deleteTarget}
        player={deleteTarget}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={showBulkDeleteConfirm} onClose={handleBulkDeleteCancel}>
        <DialogTitle>Delete Multiple Players</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedIds.size} player{selectedIds.size > 1 ? 's' : ''}?
            <br /><br />
            Players with tournament registrations cannot be deleted and will be skipped.
            <br /><br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBulkDeleteCancel} disabled={isBulkDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isBulkDeleting}
          >
            {isBulkDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSV Import Modal */}
      <CSVImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />

      {/* Delete All Players Dialog */}
      <DeleteAllPlayersDialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        onConfirm={handleDeleteAll}
        totalPlayers={data?.meta?.total || 0}
      />
    </Container>
  );
};
