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
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  GroupAdd as GroupAddIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useRegistrations } from '@/hooks/admin/useRegistrations';
import { useTournament } from '@/hooks/admin/useTournament';
import { useGenerateTeamsFromRegistrations } from '@/hooks/admin/useGenerateTeamsFromRegistrations';
import { RegisterPlayerModal } from '@/components/admin/registrations/RegisterPlayerModal';
import { RegistrationCard } from '@/components/admin/registrations/RegistrationCard';
import { ContextBar } from '@/components/admin/ContextBar';
import type { Registration } from '@/types/registration';

export function TournamentRegistrationsPage() {
  // ========== HOOKS SECTION (ALWAYS FIRST) ==========
  // Fix: Route uses :tournamentId parameter, not :id
  const params = useParams();
  const { tournamentId: tournamentIdStr } = params;
  const tournamentId = parseInt(tournamentIdStr || '0');

  // State hooks
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [pairingFilter, setPairingFilter] = useState<string>('all');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Data fetching hooks
  const { data: tournament } = useTournament(tournamentId);
  const { data, isLoading, error } = useRegistrations(tournamentId, {
    divisionId: divisionFilter !== 'all' ? parseInt(divisionFilter) : undefined,
    pairingType: pairingFilter !== 'all' ? pairingFilter : undefined
  });

  // Mutation hooks
  const generateTeamsMutation = useGenerateTeamsFromRegistrations();

  // Computed values (useMemo) - MUST be before any conditional returns
  const eligibleRegistrations = useMemo(() => {
    const regs = data?.data || [];
    return regs.filter(
      r =>
        r.pairingType === 'has_partner' &&
        r.status === 'registered' &&
        !r.teamId
    );
  }, [data]);

  const eligibleCount = useMemo(() => {
    return eligibleRegistrations.length;
  }, [eligibleRegistrations]);

  const registrations = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const stats = useMemo(() => {
    return data?.meta;
  }, [data]);

  // ========== LOGIC SECTION (AFTER ALL HOOKS) ==========
  // DEBUG: Verify tournament ID is extracted correctly
  console.log('=== REGISTRATIONS PAGE DEBUG ===');
  console.log('URL params:', params);
  console.log('tournamentId string:', tournamentIdStr);
  console.log('tournamentId parsed:', tournamentId);
  console.log('================================');

  // Handler for Generate Teams button
  const handleGenerateTeams = () => {
    if (eligibleCount === 0) {
      return;
    }

    // Get the selected division or use the first division from eligible registrations
    const selectedDivisionId = divisionFilter !== 'all'
      ? parseInt(divisionFilter)
      : eligibleRegistrations[0]?.divisionId;

    if (!selectedDivisionId) {
      alert('Please select a division first');
      return;
    }

    // Confirmation dialog
    const confirmed = window.confirm(
      `Generate teams for ${eligibleCount} registration${eligibleCount !== 1 ? 's' : ''}?\n\n` +
      'This will automatically create teams for all players with partners who don\'t have teams yet.'
    );

    if (confirmed) {
      generateTeamsMutation.mutate({
        tournamentId,
        divisionId: selectedDivisionId
      });
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

  // Group registrations by division
  const divisionGroups = registrations.reduce((acc, reg) => {
    const divisionName = reg.divisionName || 'Unknown Division';
    if (!acc[divisionName]) {
      acc[divisionName] = [];
    }
    acc[divisionName].push(reg);
    return acc;
  }, {} as Record<string, Registration[]>);

  // Get unique divisions for filter
  const divisions = Array.from(
    new Set(registrations.map(r => r.divisionName).filter(Boolean))
  );

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
          <Stack direction="row" spacing={2}>
            {/* Generate Teams Button - Show if there are eligible registrations */}
            {eligibleCount > 0 && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={
                  generateTeamsMutation.isPending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <GroupAddIcon />
                  )
                }
                onClick={handleGenerateTeams}
                disabled={generateTeamsMutation.isPending}
              >
                {generateTeamsMutation.isPending
                  ? 'Generating...'
                  : `Generate Teams (${eligibleCount})`}
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setRegisterModalOpen(true)}
            >
              Register Player
            </Button>
          </Stack>
        </Box>

        {/* Statistics Chips */}
        {stats && (
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip
              icon={<PeopleIcon />}
              label={`${stats.byPairingType.has_partner} With Partners`}
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<SearchIcon />}
              label={`${stats.byPairingType.needs_partner} Needs Partner`}
              color="warning"
              variant="outlined"
            />
            <Chip
              icon={<PersonIcon />}
              label={`${stats.byPairingType.solo} Solo`}
              color="info"
              variant="outlined"
            />
          </Stack>
        )}

        {/* Filters */}
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Division</InputLabel>
            <Select
              value={divisionFilter}
              label="Division"
              onChange={(e) => setDivisionFilter(e.target.value)}
            >
              <MenuItem value="all">All Divisions</MenuItem>
              {divisions.map((div) => (
                <MenuItem key={div} value={div}>
                  {div}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Pairing Type</InputLabel>
            <Select
              value={pairingFilter}
              label="Pairing Type"
              onChange={(e) => setPairingFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="has_partner">Has Partner</MenuItem>
              <MenuItem value="needs_partner">Needs Partner</MenuItem>
              <MenuItem value="solo">Solo</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Info Alert for Eligible Registrations */}
      {eligibleCount > 0 && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
          <AlertTitle>Registrations Ready for Teams</AlertTitle>
          {eligibleCount} registration{eligibleCount !== 1 ? 's' : ''} with
          partners can be converted to teams automatically. Click "Generate
          Teams" to create them all at once.
        </Alert>
      )}

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
        <>
          {Object.entries(divisionGroups).map(([divisionName, divRegs]) => (
            <Box key={divisionName} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {divisionName} ({divRegs.length} {divRegs.length === 1 ? 'player' : 'players'})
              </Typography>

              <Stack spacing={2}>
                {/* Group by pairing type within division */}
                {divRegs.filter(r => r.pairingType === 'has_partner').length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Teams with Partners
                    </Typography>
                    <Stack spacing={1}>
                      {divRegs
                        .filter(r => r.pairingType === 'has_partner')
                        .map(reg => (
                          <RegistrationCard
                            key={reg.id}
                            registration={reg}
                            tournamentId={tournamentId}
                          />
                        ))}
                    </Stack>
                  </Box>
                )}

                {divRegs.filter(r => r.pairingType === 'needs_partner').length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Needs Partner
                    </Typography>
                    <Stack spacing={1}>
                      {divRegs
                        .filter(r => r.pairingType === 'needs_partner')
                        .map(reg => (
                          <RegistrationCard
                            key={reg.id}
                            registration={reg}
                            tournamentId={tournamentId}
                          />
                        ))}
                    </Stack>
                  </Box>
                )}

                {divRegs.filter(r => r.pairingType === 'solo').length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Solo Players
                    </Typography>
                    <Stack spacing={1}>
                      {divRegs
                        .filter(r => r.pairingType === 'solo')
                        .map(reg => (
                          <RegistrationCard
                            key={reg.id}
                            registration={reg}
                            tournamentId={tournamentId}
                          />
                        ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>
          ))}
        </>
      )}

      {/* Register Player Modal */}
      <RegisterPlayerModal
        open={registerModalOpen}
        tournamentId={tournamentId}
        onClose={() => setRegisterModalOpen(false)}
      />
    </Box>
  );
}
