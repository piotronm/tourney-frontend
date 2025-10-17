import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Development tools for testing admin query cache optimization
 *
 * Features:
 * - Toggle admin mode (stores in localStorage)
 * - Manually invalidate all queries
 * - Display current admin mode status
 *
 * Only visible in development mode
 */
export function DevTools() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  // Load admin mode from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('dev_admin_mode');
    setIsAdmin(stored === 'true');
  }, []);

  // Toggle admin mode
  const handleToggleAdmin = () => {
    const newValue = !isAdmin;
    setIsAdmin(newValue);
    localStorage.setItem('dev_admin_mode', String(newValue));

    // Show reload message
    if (
      window.confirm(
        `Admin mode ${newValue ? 'ENABLED' : 'DISABLED'}.\n\nReload page to apply changes?`
      )
    ) {
      window.location.reload();
    }
  };

  // Invalidate all queries
  const handleInvalidateAll = () => {
    queryClient.invalidateQueries();
    console.log('[DevTools] All queries invalidated');
  };

  // Get cache info
  const cacheInfo = queryClient.getQueryCache().getAll().length;

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 9999,
        minWidth: 200,
        maxWidth: 300,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Typography variant="caption" fontWeight="bold">
          DEV TOOLS
        </Typography>
        <IconButton size="small" sx={{ color: 'white' }}>
          {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>
      </Box>

      {/* Content */}
      <Collapse in={isExpanded}>
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            {/* Admin Mode Status */}
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Current Mode:
              </Typography>
              <Chip
                icon={isAdmin ? <AdminIcon /> : <UserIcon />}
                label={isAdmin ? 'Admin Mode' : 'Public Mode'}
                color={isAdmin ? 'error' : 'default'}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>

            {/* Cache Info */}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Cached Queries: {cacheInfo}
              </Typography>
            </Box>

            {/* Actions */}
            <Stack spacing={1}>
              <Button
                variant="contained"
                size="small"
                onClick={handleToggleAdmin}
                startIcon={isAdmin ? <UserIcon /> : <AdminIcon />}
                color={isAdmin ? 'inherit' : 'error'}
                fullWidth
              >
                {isAdmin ? 'Disable Admin' : 'Enable Admin'}
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleInvalidateAll}
                startIcon={<RefreshIcon />}
                fullWidth
              >
                Invalidate All
              </Button>
            </Stack>

            {/* Help Text */}
            <Typography variant="caption" color="text.secondary">
              {isAdmin
                ? '⚡ Admin mode: staleTime=0, instant refresh'
                : '🔄 Public mode: 15-60s cache'}
            </Typography>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
}
