import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { APP_NAME } from '@/utils/constants';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    handleMenuClose();
    navigate('/admin/dashboard');
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  return (
    <AppBar position="sticky" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <TrophyIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            {APP_NAME}
          </Typography>

          {/* Auth UI - Right side of header */}
          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated && user ? (
            <>
              {/* User Avatar Button */}
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={menuOpen ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : undefined}
              >
                <Avatar alt={user.name} src={user.picture} sx={{ width: 32, height: 32 }} />
              </IconButton>

              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                id="user-menu"
                open={menuOpen}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* User Info */}
                <MenuItem disabled>
                  <ListItemText
                    primary={user.name}
                    secondary={user.email}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </MenuItem>

                {/* Dashboard Link (for admins) */}
                {user.role === 'ADMIN' && (
                  <MenuItem onClick={handleDashboard}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Admin Dashboard</ListItemText>
                  </MenuItem>
                )}

                {/* Logout */}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
