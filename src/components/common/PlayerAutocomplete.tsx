import type { FC } from 'react';
import { Autocomplete, TextField, Box, Typography, Chip } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Badge as BadgeIcon } from '@mui/icons-material';
import type { Player } from '@/types/player';

interface PlayerAutocompleteProps {
  players: Player[];
  value: Player | null;
  onChange: (player: Player | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  excludePlayerIds?: number[];
}

export const PlayerAutocomplete: FC<PlayerAutocompleteProps> = ({
  players,
  value,
  onChange,
  label = 'Select Player',
  placeholder = 'Search by name, email, or DUPR ID...',
  disabled = false,
  required = false,
  error = false,
  helperText,
  excludePlayerIds = [],
}) => {
  const filteredPlayers = players.filter(
    (player) => !excludePlayerIds.includes(player.id)
  );

  // Custom filter function - searches across name, email, and DUPR ID
  const filterOptions = (options: Player[], state: { inputValue: string }) => {
    const searchTerm = state.inputValue.toLowerCase().trim();

    if (!searchTerm) {
      return options;
    }

    return options.filter((player) => {
      const nameMatch = player.name?.toLowerCase().includes(searchTerm);
      const emailMatch = player.email?.toLowerCase().includes(searchTerm);
      const duprIdMatch = player.duprId?.toLowerCase().includes(searchTerm);

      return nameMatch || emailMatch || duprIdMatch;
    });
  };

  return (
    <Autocomplete
      value={value}
      onChange={(_event, newValue) => onChange(newValue)}
      options={filteredPlayers}
      getOptionLabel={(option) => option.name || ''}
      filterOptions={filterOptions}
      disabled={disabled}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <PersonIcon sx={{ color: 'action.active', mr: 1, ml: 1 }} />
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props as any;
        return (
          <Box component="li" {...otherProps} key={option.id}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', py: 0.5 }}>
              {/* Player Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {option.name}
                </Typography>
                {option.doublesRating && (
                  <Chip
                    label={`${option.doublesRating.toFixed(2)}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ height: 18, fontSize: '0.7rem' }}
                  />
                )}
              </Box>

              {/* Player Details */}
              <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                {option.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                )}

                {option.duprId && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BadgeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {option.duprId}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        );
      }}
      noOptionsText="No players found"
      sx={{ width: '100%' }}
    />
  );
};
