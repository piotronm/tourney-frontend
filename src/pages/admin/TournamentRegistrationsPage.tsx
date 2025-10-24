import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress,
  Avatar,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Event as EventIcon,
  Edit as EditIcon,
  PersonRemove as PersonRemoveIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRegistrations, useDeleteRegistration } from '@/hooks/admin/useRegistrations';
import { useTournament } from '@/hooks/admin/useTournament';
import { RegisterPlayerModal } from '@/components/admin/registrations/RegisterPlayerModal';
import { EditDivisionsDialog } from '@/components/admin/registrations/EditDivisionsDialog';
import { ContextBar } from '@/components/admin/ContextBar';
import type { Registration } from '@/types/registration';

export function TournamentRegistrationsPage() {
  // ========== HOOKS SECTION (ALWAYS FIRST) ==========
  // Fix: Route uses :tournamentId parameter, not :id
  const params = useParams();
  const { tournamentId: tournamentIdStr } = params;
  const tournamentId = parseInt(tournamentIdStr || '0');

  // State hooks
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [editDivisionsDialogOpen, setEditDivisionsDialogOpen] = useState(false);
  const [selectedRegistrationForEdit, setSelectedRegistrationForEdit] = useState<Registration | null>(null);

  // Data fetching hooks
  const { data: tournament } = useTournament(tournamentId);
  const { data, isLoading, error } = useRegistrations(tournamentId);

  // Mutation hooks
  const { mutate: unregisterPlayer } = useDeleteRegistration(tournamentId);
  const queryClient = useQueryClient();

  const registrations = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const stats = useMemo(() => {
    return data?.meta;
  }, [data]);

  // Helper functions
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDuprRating = (rating: number) => {
    return rating.toFixed(2);
  };

  const formatDate = (timestamp: string | number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateCompact = (timestamp: string | number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // If within last 24 hours, show "X hours ago"
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins}m ago`;
      }
      return `${diffHours}h ago`;
    }

    // If within last 7 days, show "X days ago"
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }

    // Otherwise show compact date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleEditDivisions = (registration: Registration) => {
    setSelectedRegistrationForEdit(registration);
    setEditDivisionsDialogOpen(true);
  };

  const handleUnregisterPlayer = (registration: Registration) => {
    const divisionsList = registration.divisions.map(d => d.divisionName).join(', ');

    const confirmed = window.confirm(
      `⚠️ UNREGISTER PLAYER\n\n` +
      `Player: ${registration.playerName}\n` +
      `Divisions: ${divisionsList}\n\n` +
      `This will completely remove this player from the tournament as if they never signed up.\n\n` +
      `Are you sure you want to unregister this player?`
    );

    if (!confirmed) return;

    unregisterPlayer(registration.registrationId);
  };

  const handleRemoveDivision = async (
    playerId: number,
    divisionId: number,
    divisionName: string,
    playerName: string
  ) => {
    const confirmed = window.confirm(
      `Remove ${playerName} from ${divisionName}?\n\n` +
      `If they are on a team in this division, you must remove them from the team first.`
    );

    if (!confirmed) return;

    try {
      // Use admin API endpoint (remove /public if present)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/public';
      const API_BASE = API_BASE_URL.replace('/api/public', '/api');

      await axios.delete(
        `${API_BASE}/tournaments/${tournamentId}/players/${playerId}/divisions/${divisionId}`,
        { withCredentials: true }
      );

      // Refresh the registrations list
      queryClient.invalidateQueries({
        queryKey: ['registrations', Number(tournamentId)]
      });

      toast.success(`${playerName} removed from ${divisionName}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove player from division';
      toast.error(errorMessage);
    }
  };


  // Conditional returns AFTER all hooks
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load registrations: {(error as Error).message}
      </Alert>
    );
  }


  return (
    <Box>
      {/* Context Bar */}
      {tournament && (
        <ContextBar
          tournamentId={tournamentId}
          tournamentName={tournament.name}
          showSettings={false}
        />
      )}

      {/* Header with Stats */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Registrations ({stats?.total || 0})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setRegisterModalOpen(true)}
          >
            Register Player
          </Button>
        </Box>

        {/* Statistics Chips */}
        {stats && (
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip
              icon={<PeopleIcon />}
              label={`${stats.totalDivisionAssignments} Division Assignments`}
              color="primary"
              variant="outlined"
            />
          </Stack>
        )}
      </Box>

      {/* Registration List */}
      {registrations.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Registrations Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click "Register Player" to add participants to this tournament.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setRegisterModalOpen(true)}
            >
              Register First Player
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {registrations.map((registration) => (
            <Paper
              key={registration.playerId}
              elevation={0}
              sx={{
                px: 2,
                py: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                  boxShadow: 1,
                },
              }}
            >
              {/* Row 1: Player Info (Name, Rating, DUPR ID) + Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {/* Avatar - Smaller */}
                <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: 'primary.main' }}>
                  {getInitials(registration.playerName)}
                </Avatar>

                {/* Player Name + Rating + DUPR ID */}
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {registration.playerName}
                  </Typography>

                  {registration.playerDuprRating && (
                    <Chip
                      label={formatDuprRating(registration.playerDuprRating)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: 18, fontSize: '0.7rem', fontWeight: 600 }}
                    />
                  )}

                  {registration.playerDuprId && (
                    <Chip
                      icon={<BadgeIcon sx={{ fontSize: 12 }} />}
                      label={registration.playerDuprId}
                      size="small"
                      variant="outlined"
                      sx={{ height: 18, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>

                {/* Compact Action Buttons */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Edit divisions">
                    <IconButton
                      size="small"
                      onClick={() => handleEditDivisions(registration)}
                      sx={{
                        width: 28,
                        height: 28,
                        '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' }
                      }}
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Unregister player">
                    <IconButton
                      size="small"
                      onClick={() => handleUnregisterPlayer(registration)}
                      sx={{
                        width: 28,
                        height: 28,
                        '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' }
                      }}
                    >
                      <PersonRemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Row 2: Contact Info + Date (Very Compact) */}
              <Box
                sx={{
                  pl: 5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flexWrap: 'wrap'
                }}
              >
                {registration.playerEmail && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <EmailIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {registration.playerEmail}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                  <EventIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatDateCompact(registration.registeredAt)}
                  </Typography>
                </Box>
              </Box>

              {/* Row 3: Division Chips (Smaller) */}
              <Box sx={{ pl: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.7rem', mr: 0.5 }}
                  >
                    Divisions:
                  </Typography>

                  {registration.divisions.length > 0 ? (
                    registration.divisions.map((div) => (
                      <Chip
                        key={div.divisionId}
                        label={div.divisionName}
                        size="small"
                        color={div.teamId ? 'success' : 'warning'}
                        variant="outlined"
                        icon={div.teamId ? <CheckCircleIcon sx={{ fontSize: 12 }} /> : <WarningIcon sx={{ fontSize: 12 }} />}
                        onDelete={() => handleRemoveDivision(
                          registration.playerId,
                          div.divisionId,
                          div.divisionName,
                          registration.playerName
                        )}
                        deleteIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontStyle: 'italic' }}>
                      None
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Register Player Modal */}
      <RegisterPlayerModal
        open={registerModalOpen}
        tournamentId={tournamentId}
        onClose={() => setRegisterModalOpen(false)}
      />

      {/* Edit Divisions Dialog */}
      {selectedRegistrationForEdit && (
        <EditDivisionsDialog
          open={editDivisionsDialogOpen}
          onClose={() => {
            setEditDivisionsDialogOpen(false);
            setSelectedRegistrationForEdit(null);
          }}
          registration={selectedRegistrationForEdit}
          tournamentId={tournamentId}
        />
      )}
    </Box>
  );
}
