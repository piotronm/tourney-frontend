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
 * Migration note (2025-10-23): Updated to use single name field and separate ratings
 *
 * Features:
 * - React Hook Form with Zod validation
 * - Real-time validation errors
 * - Email field disabled in edit mode
 * - Disabled state during submission
 * - Cancel button
 * - Single name field (not firstName/lastName)
 * - Separate singles and doubles rating fields
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
      name: '',
      email: '',
      phone: '',
      duprId: '',
      singlesRating: undefined,
      doublesRating: undefined,
    },
  });

  // Reset form when defaultValues changes (for edit mode with async data)
  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name || '',
        email: defaultValues.email || '',
        phone: defaultValues.phone || '',
        duprId: defaultValues.duprId || '',
        singlesRating: defaultValues.singlesRating || undefined,
        doublesRating: defaultValues.doublesRating || undefined,
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
            {/* Full Name Field */}
            <TextField
              {...register('name')}
              label="Full Name"
              fullWidth
              required
              autoFocus={mode === 'create'}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isSubmitting}
              placeholder="John Smith"
              sx={{ mb: 2 }}
            />

            {/* Email Field */}
            <TextField
              {...register('email')}
              label="Email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message || 'Optional - can be added later'}
              disabled={isSubmitting || mode === 'edit'} // Email cannot be changed in edit mode
              placeholder="player@example.com"
              sx={{ mb: 2 }}
            />

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

            {/* DUPR ID */}
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
              sx={{ mb: 2 }}
            />

            {/* DUPR Ratings */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('doublesRating')}
                  label="Doubles Rating"
                  type="number"
                  fullWidth
                  error={!!errors.doublesRating}
                  helperText={errors.doublesRating?.message || '1.0 - 7.0 (optional)'}
                  disabled={isSubmitting}
                  placeholder="4.5"
                  inputProps={{
                    step: '0.01',
                    min: '1.0',
                    max: '7.0',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('singlesRating')}
                  label="Singles Rating"
                  type="number"
                  fullWidth
                  error={!!errors.singlesRating}
                  helperText={errors.singlesRating?.message || '1.0 - 7.0 (optional)'}
                  disabled={isSubmitting}
                  placeholder="4.2"
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
