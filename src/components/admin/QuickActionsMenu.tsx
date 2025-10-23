/**
 * Quick Actions Menu Component
 * Dropdown menu for quick access to common admin actions
 */

import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface QuickAction {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  path?: string;
  divider?: boolean;
  color?: 'default' | 'error' | 'warning';
}

interface QuickActionsMenuProps {
  actions: QuickAction[];
  buttonLabel?: string;
}

/**
 * Quick Actions Menu Component
 * Provides dropdown menu with quick access to common actions
 *
 * Features:
 * - Icon button trigger
 * - Support for navigation or callbacks
 * - Optional dividers between actions
 * - Color-coded actions (default, error, warning)
 *
 * @example
 * <QuickActionsMenu
 *   actions={[
 *     { label: 'Edit', icon: <EditIcon />, path: '/edit' },
 *     { label: 'Delete', icon: <DeleteIcon />, onClick: handleDelete, color: 'error' }
 *   ]}
 * />
 */
export const QuickActionsMenu: FC<QuickActionsMenuProps> = ({
  actions,
  buttonLabel = 'Quick actions'
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.path) {
      navigate(action.path);
    }
    handleClose();
  };

  return (
    <>
      <Tooltip title={buttonLabel}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            bgcolor: open ? 'action.selected' : 'transparent',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 180,
            mt: 1
          }
        }}
      >
        {actions.map((action, index) => (
          <div key={index}>
            {action.divider && <Divider />}
            <MenuItem
              onClick={() => handleActionClick(action)}
              sx={{
                color: action.color === 'error' ? 'error.main' : action.color === 'warning' ? 'warning.main' : 'inherit'
              }}
            >
              <ListItemIcon
                sx={{
                  color: action.color === 'error' ? 'error.main' : action.color === 'warning' ? 'warning.main' : 'inherit'
                }}
              >
                {action.icon}
              </ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          </div>
        ))}
      </Menu>
    </>
  );
};
