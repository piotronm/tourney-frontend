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
  LinearProgress,
  Avatar,
  Grid,
  IconButton,
  Tooltip,
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
  Groups as GroupsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { usePools } from '@/hooks/admin/usePools';
import { useDeletePool } from '@/hooks/admin/useDeletePool';
import { useBulkCreatePools } from '@/hooks/admin/useBulkCreatePools';
import { useBulkDeletePools } from '@/hooks/admin/useBulkDeletePools';
import { useUpdatePool } from '@/hooks/admin/useUpdatePool';
import { useDivision } from '@/hooks/admin/useDivision';
import { useTournament } from '@/hooks/admin/useTournament';
import { useTeams } from '@/hooks/admin/useTeams';
import { useUpdateTeam } from '@/hooks/admin/useUpdateTeam';
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
import { TeamAssignmentSidebar, getPoolColor } from '@/components/admin/pools/TeamAssignmentSidebar';
import type { Pool } from '@/types/pool';
import type { Team } from '@/types/team';
import { getCombinedDupr, formatDuprRating } from '@/utils/formatters';

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
  const { mutate: updatePool } = useUpdatePool(parsedDivisionId!);
  const updateTeamMutation = useUpdateTeam();

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

  // Calculate team assignment statistics
  const teamStats = useMemo(() => {
    const teams = teamsData?.data || [];
    const totalTeams = teams.length;
    const assignedTeams = teams.filter(team => team.poolId !== null).length;
    const unassignedTeams = totalTeams - assignedTeams;

    return {
      total: totalTeams,
      assigned: assignedTeams,
      unassigned: unassignedTeams,
    };
  }, [teamsData]);

  // Helper function to sort teams by combined DUPR
  const getSortedTeams = (teams: Team[] | undefined) => {
    if (!teams || teams.length === 0) {
      return [];
    }

    return [...teams].sort((a, b) => {
      // Get combined DUPR for each team
      const duprA = a.players && a.players.length > 0
        ? getCombinedDupr(a.players)
        : null;
      const duprB = b.players && b.players.length > 0
        ? getCombinedDupr(b.players)
        : null;

      // Handle null ratings - teams without ratings go to bottom
      if (duprA === null && duprB === null) return 0;
      if (duprA === null) return 1;  // A goes after B
      if (duprB === null) return -1; // B goes after A

      // Both have ratings, sort descending (highest first)
      return duprB - duprA;
    });
  };

  // ========== LOGIC SECTION (AFTER ALL HOOKS) ==========
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

  // Reorder handlers
  const handleMoveUp = (pool: Pool, index: number) => {
    if (index === 0) return; // Already at top

    const prevPool = sortedPools[index - 1];

    // Swap orderIndex values - must include name and label per backend schema
    updatePool({
      poolId: pool.id,
      data: {
        name: pool.name,
        label: pool.label,
        orderIndex: prevPool.orderIndex
      }
    });
    updatePool({
      poolId: prevPool.id,
      data: {
        name: prevPool.name,
        label: prevPool.label,
        orderIndex: pool.orderIndex
      }
    });
  };

  const handleMoveDown = (pool: Pool, index: number) => {
    if (index === sortedPools.length - 1) return; // Already at bottom

    const nextPool = sortedPools[index + 1];

    // Swap orderIndex values - must include name and label per backend schema
    updatePool({
      poolId: pool.id,
      data: {
        name: pool.name,
        label: pool.label,
        orderIndex: nextPool.orderIndex
      }
    });
    updatePool({
      poolId: nextPool.id,
      data: {
        name: nextPool.name,
        label: nextPool.label,
        orderIndex: pool.orderIndex
      }
    });
  };

  // Handle assigning team to pool
  const handleAssignTeam = (teamId: number, poolId: number | null) => {
    if (!parsedTournamentId || !parsedDivisionId) return;

    updateTeamMutation.mutate({
      tournamentId: parsedTournamentId,
      divisionId: parsedDivisionId,
      teamId,
      data: {
        poolId,
      },
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
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

      {/* Sidebar + Main Content Layout */}
      <Box sx={{ display: 'flex', gap: 3, minHeight: '80vh' }}>
        {/* LEFT SIDEBAR - Teams List */}
        <Paper
          elevation={0}
          sx={{
            width: 320,
            flexShrink: 0,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 200px)',
            position: 'sticky',
            top: 100,
          }}
        >
          <TeamAssignmentSidebar
            teams={teamsData?.data || []}
            pools={pools || []}
            onAssignTeam={handleAssignTeam}
            isLoading={updateTeamMutation.isPending}
          />
        </Paper>

        {/* MAIN CONTENT - Pools */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Team Assignment Statistics */}
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Team Assignment Overview
          </Typography>

          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {/* Total Registered */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                  <GroupsIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ lineHeight: 1.2, fontWeight: 600 }}>
                    {teamStats.total}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Teams
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Assigned */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ lineHeight: 1.2, fontWeight: 600 }}>
                    {teamStats.assigned}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Assigned
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Unassigned */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: teamStats.unassigned > 0 ? 'warning.main' : 'action.disabledBackground',
                    width: 40,
                    height: 40
                  }}
                >
                  <WarningIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ lineHeight: 1.2, fontWeight: 600 }}>
                    {teamStats.unassigned}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Unassigned
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Assignment Progress */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {teamStats.total > 0
                        ? Math.round((teamStats.assigned / teamStats.total) * 100)
                        : 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={teamStats.total > 0 ? (teamStats.assigned / teamStats.total) * 100 : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: teamStats.assigned === teamStats.total ? 'success.main' : 'primary.main',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
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
      {/* Warning when teams are unassigned */}
      {teamStats.unassigned > 0 && poolCount > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>{teamStats.unassigned} team{teamStats.unassigned !== 1 ? 's' : ''}</strong>
            {' '}not assigned to any pool.
            {poolCount > 0 ? (
              <> Use the "Auto-Distribute Teams" button to organize teams into pools automatically.</>
            ) : (
              <> Create pools first, then assign teams.</>
            )}
          </Typography>
        </Alert>
      )}

      {/* Info when no teams exist */}
      {teamStats.total === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            No teams registered in this division yet.
            Teams must be created before they can be assigned to pools.
          </Typography>
        </Alert>
      )}

      {/* Warning when pools don't exist but teams do */}
      {poolCount === 0 && teamStats.total > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            {teamStats.total} team{teamStats.total !== 1 ? 's are' : ' is'} waiting to be assigned.
            Create pools first before distributing teams.
          </Typography>
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
          {sortedPools.map((pool, index) => {
            const teamCount = pool.teams?.length || 0;
            const isFirst = index === 0;
            const isLast = index === sortedPools.length - 1;

            // Sort teams by combined DUPR (highest to lowest)
            const sortedTeams = getSortedTeams(pool.teams);

            // Get pool color for consistent theming
            const poolColor = getPoolColor(pool.id, sortedPools);

            return (
              <Box key={pool.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                {/* Reorder Arrows - Outside accordion to avoid nested buttons */}
                {!selectionMode && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pt: 1 }}>
                    <Tooltip title={isFirst ? 'Already at top' : 'Move up'}>
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleMoveUp(pool, index)}
                          disabled={isFirst}
                          sx={{ width: 32, height: 32 }}
                        >
                          <ArrowUpwardIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={isLast ? 'Already at bottom' : 'Move down'}>
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleMoveDown(pool, index)}
                          disabled={isLast}
                          sx={{ width: 32, height: 32 }}
                        >
                          <ArrowDownwardIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                )}

                <Accordion defaultExpanded sx={{ flex: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      bgcolor: `${poolColor}.main`,
                      color: 'white',
                      '&:hover': {
                        bgcolor: `${poolColor}.dark`,
                      },
                      '& .MuiAccordionSummary-expandIconWrapper': {
                        color: 'white',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      {selectionMode && (
                        <Checkbox
                          checked={selectedPoolIds.has(pool.id)}
                          onChange={() => togglePoolSelection(pool.id)}
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            mr: 1,
                            color: 'white',
                            '&.Mui-checked': {
                              color: 'white',
                            },
                          }}
                        />
                      )}

                      <Chip
                        label={pool.label}
                        sx={{
                          bgcolor: 'white',
                          color: `${poolColor}.main`,
                          fontWeight: 600,
                        }}
                      />
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        {pool.name}
                      </Typography>
                      <Chip
                        icon={<PeopleIcon sx={{ color: 'white !important' }} />}
                        label={`${teamCount} team${teamCount !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                          ml: 'auto',
                          mr: 2,
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </AccordionSummary>

                <AccordionDetails>
                  {/* Teams in Pool */}
                  {teamCount > 0 ? (
                    <>
                      {/* Header with sort indicator */}
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Teams ({teamCount})
                        </Typography>
                        <Chip
                          label="Sorted by DUPR"
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>

                      <Stack spacing={1} sx={{ mb: 2 }}>
                        {sortedTeams.map((team, teamIndex) => {
                          const combinedDupr = team.players && team.players.length > 0
                            ? getCombinedDupr(team.players)
                            : null;

                          return (
                            <Box
                              key={team.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                bgcolor: 'background.default',
                                borderRadius: 1,
                              }}
                            >
                              {/* Rank Badge */}
                              <Chip
                                label={`#${teamIndex + 1}`}
                                size="small"
                                color={teamIndex === 0 ? 'primary' : 'default'}
                                sx={{
                                  width: 36,
                                  height: 24,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              />

                              {/* Team Name */}
                              <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                                {team.name}
                              </Typography>

                              {/* Combined DUPR */}
                              {combinedDupr !== null ? (
                                <Chip
                                  label={`DUPR: ${combinedDupr.toFixed(2)}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{
                                    height: 24,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                  }}
                                />
                              ) : (
                                <Chip
                                  label="No rating"
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                  sx={{
                                    height: 24,
                                    fontSize: '0.7rem',
                                  }}
                                />
                              )}
                            </Box>
                          );
                        })}
                      </Stack>
                    </>
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
              </Box>
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
        </Box>
      </Box>
    </Container>
  );
};
