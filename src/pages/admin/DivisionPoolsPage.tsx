import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  AlertTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  ButtonGroup,
  Checkbox,
  Toolbar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
  AutoFixHigh as AutoFixHighIcon,
  AutoAwesome as AutoAwesomeIcon,
  Shuffle as ShuffleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { usePools } from '@/hooks/admin/usePools';
import { useDeletePool } from '@/hooks/admin/useDeletePool';
import { useBulkCreatePools } from '@/hooks/admin/useBulkCreatePools';
import { useBulkDeletePools } from '@/hooks/admin/useBulkDeletePools';
import { useDivision } from '@/hooks/admin/useDivision';
import { useTournament } from '@/hooks/admin/useTournament';
import { useTeams } from '@/hooks/admin/useTeams';
import { useDistributeTeams } from '@/hooks/admin/useDistributeTeams';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreatePoolDialog } from '@/components/admin/CreatePoolDialog';
import { DeletePoolDialog } from '@/components/admin/DeletePoolDialog';
import { EditPoolDialog } from '@/components/admin/EditPoolDialog';
import { GenerateMatchesDialog } from '@/components/admin/GenerateMatchesDialog';
import { BulkDeletePoolsDialog } from '@/components/admin/BulkDeletePoolsDialog';
import { ContextBar } from '@/components/admin/ContextBar';
import { BackButton } from '@/components/admin/BackButton';
import type { Pool } from '@/types/pool';

/**
 * Division Pools Page
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Main page for managing pools within a division in a tournament
 *
 * Features:
 * - List all pools in division
 * - Create new pools with auto-suggestions
 * - Bulk create 4 pools at once
 * - Selection mode for bulk delete
 * - Delete pools with confirmation
 * - View teams assigned to each pool
 * - Empty state for no pools
 * - Tournament context breadcrumb navigation
 */
export const DivisionPoolsPage = () => {
  // ========== HOOKS SECTION (ALWAYS FIRST) ==========
  const { tournamentId, id } = useParams<{ tournamentId: string; id: string }>();
  const navigate = useNavigate();
  const parsedTournamentId = tournamentId ? parseInt(tournamentId, 10) : undefined;
  const parsedDivisionId = id ? parseInt(id, 10) : undefined;

  // Data fetching hooks
  const { data: tournament } = useTournament(parsedTournamentId);
  const { data: division, isLoading: divisionLoading } = useDivision(parsedTournamentId, parsedDivisionId);
  const { data: pools, isLoading: poolsLoading, error } = usePools(parsedTournamentId, parsedDivisionId);
  const { data: teamsData } = useTeams(parsedTournamentId, {
    divisionId: parsedDivisionId!,
    limit: 100 // Get all teams for the division
  });
  const { mutate: deletePool, isPending: isDeleting } = useDeletePool(parsedDivisionId!);
  const { mutate: bulkCreatePools, isPending: isCreatingBulk } = useBulkCreatePools();
  const { mutate: bulkDeletePools, isPending: isDeletingBulk } = useBulkDeletePools(parsedDivisionId!);

  // Distribution state
  const [distributeDialogOpen, setDistributeDialogOpen] = useState(false);
  const [distributionStrategy, setDistributionStrategy] = useState<'balanced' | 'random'>('balanced');
  const distributeTeamsMutation = useDistributeTeams();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPoolIds, setSelectedPoolIds] = useState<Set<number>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    pool: Pool | null;
  }>({ open: false, pool: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    pool: Pool | null;
  }>({ open: false, pool: null });

  // Computed values (useMemo) - MUST be before any conditional returns
  const unassignedTeamsCount = useMemo(() => {
    // teamsData has shape: { data: Team[], meta: {...} }
    return teamsData?.data?.filter((t) => !t.poolId).length || 0;
  }, [teamsData]);

  const poolCount = useMemo(() => {
    return pools?.length || 0;
  }, [pools]);

  const sortedPools = useMemo(() => {
    return pools?.sort((a, b) => a.orderIndex - b.orderIndex) || [];
  }, [pools]);

  // ========== LOGIC SECTION (AFTER ALL HOOKS) ==========
  // DEBUG: Auto-Distribute button visibility
  console.log('=== AUTO-DISTRIBUTE DEBUG ===');
  console.log('poolCount:', poolCount);
  console.log('unassignedTeamsCount:', unassignedTeamsCount);
  console.log('teamsData:', teamsData);
  console.log('pools:', pools);
  console.log('Button should show?', poolCount > 0 && unassignedTeamsCount > 0);
  console.log('============================');
  // Loading state
  if (divisionLoading || poolsLoading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg">
        <ErrorMessage message="Failed to load pools" />
      </Container>
    );
  }

  // Division not found
  if (!division) {
    return (
      <Container maxWidth="lg">
        <ErrorMessage message="Division not found" />
      </Container>
    );
  }

  // Calculate next label and order index
  const getNextLabel = () => {
    if (!pools || pools.length === 0) return 'A';
    const lastLabel = sortedPools[sortedPools.length - 1].label;
    return String.fromCharCode(lastLabel.charCodeAt(0) + 1);
  };

  const getNextOrderIndex = () => {
    if (!pools || pools.length === 0) return 1;
    return sortedPools[sortedPools.length - 1].orderIndex + 1;
  };

  // Handler for Auto-Distribute button
  const handleDistribute = () => {
    if (!parsedTournamentId || !parsedDivisionId) return;

    distributeTeamsMutation.mutate(
      {
        tournamentId: parsedTournamentId,
        divisionId: parsedDivisionId,
        strategy: distributionStrategy
      },
      {
        onSuccess: () => {
          setDistributeDialogOpen(false);
        }
      }
    );
  };

  const handleEditClick = (pool: Pool) => {
    setEditDialog({ open: true, pool });
  };

  const handleDeleteClick = (pool: Pool) => {
    setDeleteDialog({ open: true, pool });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.pool && parsedTournamentId && parsedDivisionId) {
      deletePool(
        deleteDialog.pool.id,
        {
          onSuccess: () => {
            setDeleteDialog({ open: false, pool: null });
          },
        }
      );
    }
  };

  const handleTemplateCreate = (count: number) => {
    if (!parsedTournamentId || !parsedDivisionId) return;

    setTemplateMenuAnchor(null);

    // Generate pools array from count
    const pools = Array.from({ length: count }, (_, i) => ({
      name: `Pool ${String.fromCharCode(65 + i)}`,
      label: String.fromCharCode(65 + i),
      orderIndex: i + 1,
    }));

    bulkCreatePools({
      tournamentId: parsedTournamentId,
      divisionId: parsedDivisionId,
      pools
    });
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedPoolIds(new Set());
  };

  const togglePoolSelection = (poolId: number) => {
    const newSet = new Set(selectedPoolIds);
    if (newSet.has(poolId)) {
      newSet.delete(poolId);
    } else {
      newSet.add(poolId);
    }
    setSelectedPoolIds(newSet);
  };

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = () => {
    if (!parsedTournamentId || !parsedDivisionId) return;

    bulkDeletePools(
      Array.from(selectedPoolIds),
      {
        onSuccess: () => {
          setSelectedPoolIds(new Set());
          setSelectionMode(false);
          setBulkDeleteDialogOpen(false);
        },
      }
    );
  };

  const selectedPools = pools?.filter(p => selectedPoolIds.has(p.id)) || [];

  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/admin/tournaments')}
        >
          Tournaments
        </Link>
        {tournament && (
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate(`/admin/tournaments/${tournamentId}`)}
          >
            {tournament.name}
          </Link>
        )}
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions`)}
        >
          Divisions
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${id}`)}
        >
          {division?.name}
        </Link>
        <Typography color="text.primary">Pools</Typography>
      </Breadcrumbs>

      {/* Context Bar */}
      {tournament && division && (
        <ContextBar
          tournamentId={parsedTournamentId!}
          tournamentName={tournament.name}
          divisionId={parsedDivisionId!}
          divisionName={division.name}
        />
      )}

      {/* Back Button */}
      <BackButton
        to={`/admin/tournaments/${tournamentId}/divisions/${id}`}
        label="Back to Division"
      />

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Manage Pools
          </Typography>
          <Typography color="text.secondary">
            {division.name}
          </Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="text"
            onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${id}/matches`)}
          >
            View Matches
          </Button>
          <Button
            variant="outlined"
            startIcon={<AutoFixHighIcon />}
            onClick={() => setGenerateDialogOpen(true)}
            disabled={sortedPools.length === 0}
          >
            Generate Matches
          </Button>
          <ButtonGroup variant="contained">
            <Button
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              disabled={isCreatingBulk}
            >
              Create Pool
            </Button>
            <Button
              size="small"
              onClick={(e) => setTemplateMenuAnchor(e.currentTarget)}
              disabled={isCreatingBulk}
            >
              <ExpandMoreIcon />
            </Button>
          </ButtonGroup>
          <Menu
            anchorEl={templateMenuAnchor}
            open={Boolean(templateMenuAnchor)}
            onClose={() => setTemplateMenuAnchor(null)}
          >
            <MenuItem onClick={() => handleTemplateCreate(2)}>
              Create 2 Pools (A, B)
            </MenuItem>
            <MenuItem onClick={() => handleTemplateCreate(4)}>
              Create 4 Pools (A, B, C, D)
            </MenuItem>
            <MenuItem onClick={() => handleTemplateCreate(8)}>
              Create 8 Pools (A-H)
            </MenuItem>
            <MenuItem onClick={() => handleTemplateCreate(16)}>
              Create 16 Pools (A-P)
            </MenuItem>
          </Menu>
          {/* Auto-Distribute Button - Show if there are pools and unassigned teams */}
          {poolCount > 0 && unassignedTeamsCount > 0 && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => setDistributeDialogOpen(true)}
              disabled={distributeTeamsMutation.isPending}
            >
              Auto-Distribute Teams ({unassignedTeamsCount})
            </Button>
          )}
          <Button
            variant={selectionMode ? 'contained' : 'outlined'}
            color={selectionMode ? 'secondary' : 'primary'}
            onClick={toggleSelectionMode}
            disabled={sortedPools.length === 0 || isDeletingBulk}
            sx={{ ml: 2 }}
          >
            {selectionMode ? 'Cancel Selection' : 'Select Multiple'}
          </Button>
        </Box>
      </Box>

      {/* Selection toolbar - shows when pools are selected */}
      {selectionMode && selectedPoolIds.size > 0 && (
        <Paper elevation={2} sx={{ mb: 2 }}>
          <Toolbar sx={{ bgcolor: 'primary.light' }}>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {selectedPoolIds.size} pool(s) selected
            </Typography>
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              variant="contained"
              onClick={handleBulkDeleteClick}
              disabled={isDeletingBulk}
            >
              Delete Selected
            </Button>
          </Toolbar>
        </Paper>
      )}

      {/* Info Alerts */}
      {unassignedTeamsCount > 0 && poolCount > 0 && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
          <AlertTitle>Unassigned Teams</AlertTitle>
          {unassignedTeamsCount} team{unassignedTeamsCount !== 1 ? 's are' : ' is'} not
          assigned to any pool. Use "Auto-Distribute" to assign them automatically.
        </Alert>
      )}

      {poolCount === 0 && teamsData && teamsData.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>No Pools Created</AlertTitle>
          Create pools first before distributing teams.
        </Alert>
      )}

      {/* Empty State */}
      {sortedPools.length === 0 && (
        <EmptyState
          title="No pools created yet"
          description="Create pools to organize teams and generate matches"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create First Pool
            </Button>
          }
        />
      )}

      {/* Pools List */}
      {sortedPools.length > 0 && (
        <Stack spacing={2}>
          {sortedPools.map((pool) => {
            const teamCount = pool.teams?.length || 0;

            return (
              <Accordion key={pool.id} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    {selectionMode && (
                      <Checkbox
                        checked={selectedPoolIds.has(pool.id)}
                        onChange={() => togglePoolSelection(pool.id)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ mr: 1 }}
                      />
                    )}
                    <Chip label={pool.label} color="primary" />
                    <Typography variant="h6">{pool.name}</Typography>
                    <Chip
                      icon={<PeopleIcon />}
                      label={`${teamCount} team${teamCount !== 1 ? 's' : ''}`}
                      size="small"
                      sx={{ ml: 'auto', mr: 2 }}
                    />
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  {/* Teams in Pool */}
                  {teamCount > 0 ? (
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      {pool.teams!.map((team, index) => (
                        <Box
                          key={team.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                          }}
                        >
                          <Chip label={`Seed ${index + 1}`} size="small" sx={{ mr: 2 }} />
                          <Typography>{team.name}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      No teams assigned to this pool yet.{' '}
                      <Link
                        component="button"
                        onClick={() => navigate(`/admin/tournaments/${tournamentId}/divisions/${id}/teams`)}
                        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Assign teams →
                      </Link>
                    </Alert>
                  )}

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(pool)}
                    >
                      Edit Pool
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(pool)}
                    >
                      Delete Pool
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      )}

      {/* Create Pool Dialog */}
      <CreatePoolDialog
        open={createDialogOpen}
        tournamentId={parsedTournamentId!}
        divisionId={parsedDivisionId!}
        onClose={() => setCreateDialogOpen(false)}
        nextOrderIndex={getNextOrderIndex()}
        nextLabel={getNextLabel()}
      />

      {/* Edit Pool Dialog */}
      <EditPoolDialog
        open={editDialog.open}
        pool={editDialog.pool}
        divisionId={parsedDivisionId}
        onClose={() => setEditDialog({ open: false, pool: null })}
      />

      {/* Delete Pool Dialog */}
      <DeletePoolDialog
        open={deleteDialog.open}
        pool={deleteDialog.pool}
        onClose={() => setDeleteDialog({ open: false, pool: null })}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/* Generate Matches Dialog */}
      <GenerateMatchesDialog
        open={generateDialogOpen}
        tournamentId={parsedTournamentId!}
        divisionId={parsedDivisionId!}
        pools={sortedPools}
        onClose={() => setGenerateDialogOpen(false)}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <BulkDeletePoolsDialog
        open={bulkDeleteDialogOpen}
        pools={selectedPools}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeletingBulk}
      />

      {/* Distribution Dialog */}
      <Dialog
        open={distributeDialogOpen}
        onClose={() => setDistributeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Auto-Distribute Teams to Pools
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Distribute {unassignedTeamsCount} unassigned team
              {unassignedTeamsCount !== 1 ? 's' : ''} across {poolCount} pool
              {poolCount !== 1 ? 's' : ''}.
            </Typography>

            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
              Distribution Strategy
            </FormLabel>
            <RadioGroup
              value={distributionStrategy}
              onChange={(e) =>
                setDistributionStrategy(e.target.value as 'balanced' | 'random')
              }
            >
              <FormControlLabel
                value="balanced"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Balanced (Recommended)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Teams distributed evenly across pools (e.g., 5-5-5-5)
                    </Typography>
                  </Box>
                }
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                value="random"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Random
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Teams shuffled randomly before distribution
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>

            {/* Preview */}
            <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 3 }}>
              <Typography variant="caption">
                <strong>Approximate result:</strong> Each pool will have{' '}
                {Math.floor(unassignedTeamsCount / poolCount)}-
                {Math.ceil(unassignedTeamsCount / poolCount)} teams
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDistributeDialogOpen(false)}
            disabled={distributeTeamsMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDistribute}
            disabled={distributeTeamsMutation.isPending}
            startIcon={
              distributeTeamsMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : distributionStrategy === 'random' ? (
                <ShuffleIcon />
              ) : (
                <AutoAwesomeIcon />
              )
            }
          >
            {distributeTeamsMutation.isPending
              ? 'Distributing...'
              : 'Distribute Teams'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
