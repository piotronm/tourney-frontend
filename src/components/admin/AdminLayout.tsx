import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Toolbar,
  Typography,
  IconButton,
  AppBar,
} from '@mui/material';
import {
  Help as HelpIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsDialog } from '@/components/admin/KeyboardShortcutsDialog';
import { AdminBreadcrumbs } from '@/components/admin/Breadcrumbs';

/**
 * AdminLayout - Main layout for admin section
 * UPDATED: Phase 4B - Removed sidebar navigation
 *
 * Tournament hub provides all navigation via action tiles.
 * Sidebar was obsolete after tournament hierarchy restructure.
 */
export const AdminLayout = () => {
  const { user } = useAuth();
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false);

  // Add keyboard shortcuts
  useKeyboardShortcuts([], () => setShortcutsDialogOpen(true));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar
        position="static"
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          {/* Left: Admin Title */}
          <Typography variant="h6" component="div" fontWeight={600} sx={{ flexGrow: 1 }}>
            BracketIQ Admin
          </Typography>

          {/* Right: User Email + Help Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Signed in as
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {user?.email}
              </Typography>
            </Box>
            <IconButton
              color="inherit"
              onClick={() => setShortcutsDialogOpen(true)}
              title="Keyboard shortcuts (?)"
              size="small"
            >
              <HelpIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content - Full Width */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        {/* Breadcrumbs Navigation */}
        <AdminBreadcrumbs />

        <Outlet />
      </Box>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={shortcutsDialogOpen}
        onClose={() => setShortcutsDialogOpen(false)}
      />
    </Box>
  );
};
