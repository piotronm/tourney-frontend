import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import type { Registration } from '@/types/registration';
import { UnregisterDialog } from './UnregisterDialog';

interface RegistrationCardProps {
  registration: Registration;
  tournamentId: number;
}

export function RegistrationCard({ registration, tournamentId }: RegistrationCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getPairingIcon = () => {
    switch (registration.pairingType) {
      case 'has_partner':
        return <PeopleIcon fontSize="small" />;
      case 'needs_partner':
        return <SearchIcon fontSize="small" />;
      case 'solo':
        return <PersonIcon fontSize="small" />;
    }
  };

  const getPairingColor = () => {
    switch (registration.pairingType) {
      case 'has_partner':
        return 'success';
      case 'needs_partner':
        return 'warning';
      case 'solo':
        return 'info';
    }
  };

  const getPairingLabel = () => {
    switch (registration.pairingType) {
      case 'has_partner':
        return 'Has Partner';
      case 'needs_partner':
        return 'Needs Partner';
      case 'solo':
        return 'Solo';
    }
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              {/* Player Name */}
              <Typography variant="h6">
                {registration.player.firstName} {registration.player.lastName}
                {registration.partner && (
                  <>
                    {' + '}
                    {registration.partner.firstName} {registration.partner.lastName}
                  </>
                )}
              </Typography>

              {/* DUPR Ratings */}
              <Typography variant="body2" color="text.secondary">
                DUPR: {registration.player.duprRating || 'N/A'}
                {registration.partner && (
                  <> / {registration.partner.duprRating || 'N/A'}</>
                )}
                {registration.partner && registration.player.duprRating && registration.partner.duprRating && (
                  <>
                    {' '}
                    (Avg:{' '}
                    {(
                      (registration.player.duprRating + registration.partner.duprRating) /
                      2
                    ).toFixed(2)}
                    )
                  </>
                )}
              </Typography>

              {/* Notes */}
              {registration.notes && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Note: {registration.notes}
                </Typography>
              )}

              {/* Pairing Type Chip */}
              <Box sx={{ mt: 1 }}>
                <Chip
                  icon={getPairingIcon()}
                  label={getPairingLabel()}
                  color={getPairingColor()}
                  size="small"
                />
              </Box>
            </Box>

            {/* Actions */}
            <IconButton
              size="small"
              onClick={() => setDeleteDialogOpen(true)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <UnregisterDialog
        open={deleteDialogOpen}
        registration={registration}
        tournamentId={tournamentId}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}
