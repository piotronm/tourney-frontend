import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Chip,
  IconButton,
  AppBar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  EmojiEvents as DivisionIcon,
  Groups as TeamsIcon,
  ViewModule as PoolsIcon,
  SportsTennis as MatchesIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsDialog } from '@/components/admin/KeyboardShortcutsDialog';

const DRAWER_WIDTH = 240;

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false);

  // Add keyboard shortcuts
  useKeyboardShortcuts([], () => setShortcutsDialogOpen(true));

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
      exact: true
    },
    {
      text: 'Divisions',
      icon: <DivisionIcon />,
      path: '/admin/divisions',
      exact: false
    },
    {
      text: 'Teams',
      icon: <TeamsIcon />,
      path: '/admin/teams',
      exact: false,
      badge: 'Soon'
    },
    {
      text: 'Pools',
      icon: <PoolsIcon />,
      path: '/admin/pools',
      exact: false,
      badge: 'Soon'
    },
    {
      text: 'Matches',
      icon: <MatchesIcon />,
      path: '/admin/matches',
      exact: false,
      badge: 'Soon'
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings',
      exact: false,
      badge: 'Soon'
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={() => setShortcutsDialogOpen(true)}
            title="Keyboard shortcuts (?)"
            size="small"
          >
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" fontWeight={600}>
            BracketIQ Admin
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={
                  item.exact
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path)
                }
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="default"
                    sx={{ ml: 1, fontSize: '0.65rem', height: 20 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* User Info at Bottom */}
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Signed in as
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {user?.email}
          </Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        <Toolbar /> {/* Spacer for app bar height */}
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
