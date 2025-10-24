import { useState, useMemo } from 'react';
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
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Warning from '@mui/icons-material/Warning';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import { useTeams } from '@/hooks/admin/useTeams';
import { useDeleteTeam } from '@/hooks/admin/useDeleteTeam';
import { useDivision } from '@/hooks/admin/useDivision';
import { useTournament } from '@/hooks/admin/useTournament';
import { useRegistrations } from '@/hooks/admin/useRegistrations';
import { useDebounce } from '@/hooks/useDebounce';
import { TeamCard } from '@/components/admin/TeamCard';
import { DeleteTeamDialog } from '@/components/admin/DeleteTeamDialog';
import { BulkImportTeamsDialog } from '@/components/admin/BulkImportTeamsDialog';
import { CreateTeamDialog } from '@/components/admin/CreateTeamDialog';
import { EditTeamRosterDialog } from '@/components/admin/EditTeamRosterDialog';
import { ContextBar } from '@/components/admin/ContextBar';
import { BackButton } from '@/components/admin/BackButton';
import { useBulkImportTeams } from '@/hooks/admin/useBulkImportTeams';
import type { Team, BulkImportTeam } from '@/types/team';
import { getInitials, formatDuprRating, getCombinedDupr } from '@/utils/formatters';

/**
 * Division Teams Page
 * UPDATED: Phase 4B - Tournament Hierarchy
 *
 * Main page for managing teams within a division in a tournament
 *
 * Features:
 * - List all teams in division
 * - Search teams by name
 * - Filter by pool
 * - Add single team
 * - Bulk import teams from CSV
 * - Edit/delete teams
 * - Pagination
 * - Tournament context breadcrumbs
 */
export const DivisionTeamsPage = () => {
  const { tournamentId, id } = useParams<{ tournamentId: string; id: string }>();
  const navigate = useNavigate();
  const parsedTournamentId = tournamentId ? parseInt(tournamentId, 10) : undefined;
  const parsedDivisionId = id ? parseInt(id, 10) : undefined;

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamFilter, setTeamFilter] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [playerDrawerOpen, setPlayerDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const limit = 20;
  const offset = (page - 1) * limit;

  // Fetch tournament and division info
  const { data: tournament } = useTournament(parsedTournamentId);
  const { data: division, isLoading: isDivisionLoading } = useDivision(parsedTournamentId, parsedDivisionId);

  // Fetch teams
  const { data, isLoading, isError, error } = useTeams(parsedTournamentId, {
    divisionId: parsedDivisionId,
    limit,
    offset,
    search: debouncedSearch || undefined,
  });

  // Delete mutation
  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeam();

  // Bulk import mutation
  const { mutate: bulkImport, isPending: isImporting } = useBulkImportTeams();

  // Fetch registrations for player statistics
  const { data: registrationsData } = useRegistrations(parsedTournamentId, {
    divisionId: parsedDivisionId,
  });

  const teams = data?.data || [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  // Calculate player statistics
  const playerStats = useMemo(() => {
    if (!registrationsData?.data || !parsedDivisionId) {
      return { total: 0, onTeams: 0, needTeams: 0 };
    }

    // Count players assigned to this division
    let totalPlayers = 0;
    let playersOnTeams = 0;

    registrationsData.data.forEach((registration: any) => {
      const divisionAssignment = registration.divisions?.find(
        (div: any) => div.divisionId === parsedDivisionId
      );

      if (divisionAssignment) {
        totalPlayers++;
        if (divisionAssignment.teamId) {
          playersOnTeams++;
        }
      }
    });

    return {
      total: totalPlayers,
      onTeams: playersOnTeams,
      needTeams: totalPlayers - playersOnTeams,
    };
  }, [registrationsData, parsedDivisionId]);

  // Extract player list for drawer
  const divisionPlayers = useMemo(() => {
    if (!registrationsData?.data || !parsedDivisionId) return [];

    const players: Array<{
      id: number;
      name: string;
      email: string;
      duprId: string | null;
      singlesRating: number | null;
      doublesRating: number | null;
      teamId: number | null;
      teamName: string | null;
    }> = [];

    registrationsData.data.forEach((registration: any) => {
      const divisionAssignment = registration.divisions?.find(
        (div: any) => div.divisionId === parsedDivisionId
      );

      if (divisionAssignment && registration.player) {
        players.push({
          id: registration.player.id,
          name: registration.player.name,
          email: registration.player.email || '',
          duprId: registration.player.duprId || null,
          singlesRating: registration.player.singlesRating || null,
          doublesRating: registration.player.doublesRating || null,
          teamId: divisionAssignment.teamId || null,
          teamName: divisionAssignment.teamName || null,
        });
      }
    });

    // Sort: players needing teams first, then alphabetically
    return players.sort((a, b) => {
      if (a.teamId === null && b.teamId !== null) return -1;
      if (a.teamId !== null && b.teamId === null) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [registrationsData, parsedDivisionId]);

  // Filter teams based on completion status
  const filteredTeams = useMemo(() => {
    if (teamFilter === 'all') return teams;

    return teams.filter(team => {
      const playerCount = team.players?.length || 0;
      const isComplete = playerCount === 2;

      if (teamFilter === 'complete') return isComplete;
      if (teamFilter === 'incomplete') return !isComplete;
      return true;
    });
  }, [teams, teamFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: 'all' | 'complete' | 'incomplete' | null) => {
    if (newFilter !== null) {
      setTeamFilter(newFilter);
      setPage(1); // Reset to first page on filter change
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddTeam = () => {
    navigate(`/admin/tournaments/${tournamentId}/divisions/${id}/teams/new`);
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedTeam(null);
  };

  const handleDeleteClick = (team: Team) => {
    setDeleteTarget(team);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget || !parsedTournamentId || !parsedDivisionId) return;

    deleteTeam(
      { tournamentId: parsedTournamentId, divisionId: parsedDivisionId, teamId: deleteTarget.id },
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
    if (!parsedTournamentId || !parsedDivisionId) return;

    bulkImport(
      { tournamentId: parsedTournamentId, divisionId: parsedDivisionId, teams },
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
          onClick={() => navigate('/admin/tournaments')}
        >
          Tournaments
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/admin/tournaments/${tournamentId}`)}
        >
          Tournament
        </Link>
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
        <Typography color="text.primary">Teams</Typography>
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
            variant="outlined"
            startIcon={<GroupAddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Team
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

      {/* Player Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="caption" display="block">
                    Total Players
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {playerStats.total}
                  </Typography>
                </Box>
                <Box sx={{ color: 'primary.main', opacity: 0.7 }}>
                  <PeopleIcon sx={{ fontSize: 48 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="caption" display="block">
                    On Teams
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {playerStats.onTeams}
                  </Typography>
                </Box>
                <Box sx={{ color: 'success.main', opacity: 0.7 }}>
                  <GroupsIcon sx={{ fontSize: 48 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="caption" display="block">
                    Need Teams
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {playerStats.needTeams}
                  </Typography>
                </Box>
                <Box sx={{ color: 'warning.main', opacity: 0.7 }}>
                  <PersonAddIcon sx={{ fontSize: 48 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
          <Button
            variant="outlined"
            startIcon={<PeopleIcon />}
            onClick={() => setPlayerDrawerOpen(true)}
            sx={{ flexShrink: 0 }}
          >
            View Players ({divisionPlayers.length})
          </Button>
        </Box>

        {/* Team Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterListIcon sx={{ color: 'text.secondary' }} />
          <ToggleButtonGroup
            value={teamFilter}
            exclusive
            onChange={handleFilterChange}
            size="small"
          >
            <ToggleButton value="all">
              All Teams ({teams.length})
            </ToggleButton>
            <ToggleButton value="complete">
              <CheckCircleIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Complete ({teams.filter(t => (t.players?.length || 0) === 2).length})
            </ToggleButton>
            <ToggleButton value="incomplete">
              <ErrorIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Incomplete ({teams.filter(t => (t.players?.length || 0) < 2).length})
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
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

      {/* Teams List - Compact Rows */}
      {!isLoading && !isError && filteredTeams.length > 0 && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {filteredTeams.map((team) => (
              <Paper
                key={team.id}
                elevation={0}
                sx={{
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  minHeight: 56,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                    boxShadow: 1,
                  },
                }}
              >
                {/* Team Name & Combined DUPR */}
                <Box sx={{ minWidth: 200, flex: '0 0 auto' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {team.name}
                    </Typography>
                    {/* Incomplete Team Warning */}
                    {team.players && team.players.length === 1 && (
                      <Tooltip title="Incomplete team - needs another player">
                        <Warning
                          sx={{
                            fontSize: 18,
                            color: 'warning.main',
                            cursor: 'help',
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                  {/* Combined DUPR calculated from players */}
                  {team.players && team.players.length > 0 && (
                    <Chip
                      label={`DUPR: ${getCombinedDupr(team.players).toFixed(2)}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{
                        height: 18,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        mt: 0.5,
                        '& .MuiChip-label': {
                          px: 1,
                        }
                      }}
                    />
                  )}
                </Box>

                {/* Player 1 */}
                {team.players && team.players[0] && (
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: 'primary.main' }}>
                      {getInitials(team.players[0].name)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          lineHeight: 1.1,
                          fontSize: '0.875rem',
                        }}
                        noWrap
                      >
                        {team.players[0].name}
                      </Typography>
                      {team.players[0].doublesRating && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}
                        >
                          {formatDuprRating(team.players[0].doublesRating)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Player 2 */}
                {team.players && team.players[1] && (
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: 'secondary.main' }}>
                      {getInitials(team.players[1].name)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          lineHeight: 1.1,
                          fontSize: '0.875rem',
                        }}
                        noWrap
                      >
                        {team.players[1].name}
                      </Typography>
                      {team.players[1].doublesRating && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}
                        >
                          {formatDuprRating(team.players[1].doublesRating)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Pool Assignment */}
                <Box sx={{ flex: '0 0 100px' }}>
                  {team.pool ? (
                    <Chip
                      label={team.pool.name}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ height: 20 }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No pool
                    </Typography>
                  )}
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditTeam(team)}
                    title="Edit roster"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(team)}
                    color="error"
                    title="Delete team"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
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

      {/* Create Team Dialog */}
      {parsedTournamentId && parsedDivisionId && (
        <CreateTeamDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          tournamentId={parsedTournamentId}
          divisionId={parsedDivisionId}
          divisionName={division?.name}
        />
      )}

      {/* Edit Team Roster Dialog */}
      {parsedTournamentId && parsedDivisionId && selectedTeam && (
        <EditTeamRosterDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          team={selectedTeam}
          tournamentId={parsedTournamentId}
          divisionId={parsedDivisionId}
        />
      )}

      {/* Player Overview Drawer */}
      <Drawer
        anchor="right"
        open={playerDrawerOpen}
        onClose={() => setPlayerDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Division Players</Typography>
          <IconButton onClick={() => setPlayerDrawerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Player Stats Summary */}
        <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary" display="block">Total</Typography>
              <Typography variant="h6">{divisionPlayers.length}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary" display="block">On Teams</Typography>
              <Typography variant="h6" color="success.main">
                {divisionPlayers.filter(p => p.teamId !== null).length}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary" display="block">Need Teams</Typography>
              <Typography variant="h6" color="error.main">
                {divisionPlayers.filter(p => p.teamId === null).length}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Player List */}
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {divisionPlayers.map((player, index) => (
            <Box key={player.id}>
              {index > 0 && <Divider />}
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: player.teamId ? 'success.main' : 'error.main' }}>
                    {getInitials(player.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {player.name}
                      </Typography>
                      {player.teamId ? (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="On Team"
                          size="small"
                          color="success"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      ) : (
                        <Chip
                          icon={<ErrorIcon />}
                          label="Needs Team"
                          size="small"
                          color="error"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      {player.teamName && (
                        <Typography variant="caption" display="block" sx={{ color: 'success.dark' }}>
                          Team: {player.teamName}
                        </Typography>
                      )}
                      {player.duprId && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          DUPR: {player.duprId}
                        </Typography>
                      )}
                      {(player.doublesRating || player.singlesRating) && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          {player.doublesRating && (
                            <Chip
                              label={`D: ${player.doublesRating.toFixed(2)}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ height: 18, fontSize: '0.65rem' }}
                            />
                          )}
                          {player.singlesRating && (
                            <Chip
                              label={`S: ${player.singlesRating.toFixed(2)}`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                              sx={{ height: 18, fontSize: '0.65rem' }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            </Box>
          ))}
          {divisionPlayers.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No players registered for this division</Typography>
            </Box>
          )}
        </List>
      </Drawer>
    </Container>
  );
};
