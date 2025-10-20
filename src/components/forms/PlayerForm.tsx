import type { FC } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
} from '@mui/material';
import { playerSchema, type PlayerFormData } from '@/schemas/playerSchema';
import type { Player } from '@/types/player';

interface PlayerFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Player;
  onSubmit: (data: PlayerFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Player form component
 * Used for both creating and editing players
 *
 * Features:
 * - React Hook Form with Zod validation
 * - Real-time validation errors
 * - Email field disabled in edit mode
 * - Disabled state during submission
 * - Cancel button
 * - 2-column layout for name fields
 */
export const PlayerForm: FC<PlayerFormProps> = ({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      duprId: '',
      duprRating: undefined,
    },
  });

  // Reset form when defaultValues changes (for edit mode with async data)
  useEffect(() => {
    if (defaultValues) {
      reset({
        email: defaultValues.email || '',
        firstName: defaultValues.firstName || '',
        lastName: defaultValues.lastName || '',
        phone: defaultValues.phone || '',
        duprId: defaultValues.duprId || '',
        duprRating: defaultValues.duprRating || undefined,
      });
    }
  }, [defaultValues, reset]);

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {mode === 'create' ? 'Add New Player' : 'Edit Player'}
          </Typography>

          <Box sx={{ mt: 3 }}>
            {/* Email Field */}
            <TextField
              {...register('email')}
              label="Email"
              fullWidth
              autoFocus={mode === 'create'}
              error={!!errors.email}
              helperText={errors.email?.message || 'Optional - can be added later'}
              disabled={isSubmitting || mode === 'edit'} // Email cannot be changed in edit mode
              placeholder="player@example.com"
              sx={{ mb: 2 }}
            />

            {/* First Name & Last Name */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('firstName')}
                  label="First Name"
                  fullWidth
                  required
                  autoFocus={mode === 'edit'}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isSubmitting}
                  placeholder="John"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('lastName')}
                  label="Last Name"
                  fullWidth
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isSubmitting}
                  placeholder="Doe"
                />
              </Grid>
            </Grid>

            {/* Phone Field */}
            <TextField
              {...register('phone')}
              label="Phone"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
              disabled={isSubmitting}
              placeholder="(555) 123-4567"
              sx={{ mb: 2 }}
            />

            {/* DUPR ID & Rating */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('duprId')}
                  label="DUPR ID"
                  fullWidth
                  error={!!errors.duprId}
                  helperText={errors.duprId?.message || '6 characters (letters and numbers, optional)'}
                  disabled={isSubmitting}
                  placeholder="76NWX4"
                  inputProps={{
                    maxLength: 6,
                    style: { textTransform: 'uppercase' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('duprRating')}
                  label="DUPR Rating"
                  type="number"
                  fullWidth
                  error={!!errors.duprRating}
                  helperText={errors.duprRating?.message || '1.0 - 7.0'}
                  disabled={isSubmitting}
                  placeholder="4.5"
                  inputProps={{
                    step: '0.01',
                    min: '1.0',
                    max: '7.0',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
          <Button onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || (mode === 'edit' && !isDirty)}
          >
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Saving...'
              : mode === 'create'
              ? 'Create Player'
              : 'Save Changes'}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};
