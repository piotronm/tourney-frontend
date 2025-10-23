/**
 * Create Success Dialog
 * Shows success message after creating items with clear next steps
 */

import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface NextStepAction {
  label: string;
  description?: string;
  icon: ReactNode;
  path?: string;
  onClick?: () => void;
  primary?: boolean;
}

interface CreateSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  entityName: string;
  nextSteps?: NextStepAction[];
}

/**
 * Create Success Dialog Component
 * Displays success message with suggested next actions
 *
 * Features:
 * - Success message with entity name
 * - List of suggested next steps
 * - Primary and secondary actions
 * - Auto-navigation support
 *
 * @example
 * <CreateSuccessDialog
 *   open={true}
 *   onClose={handleClose}
 *   title="Team Created"
 *   message="Your team has been created successfully"
 *   entityName="Team Alpha"
 *   nextSteps={[
 *     { label: 'Add Players', path: '/teams/1/players', icon: <PersonIcon />, primary: true },
 *     { label: 'View Team', path: '/teams/1', icon: <VisibilityIcon /> }
 *   ]}
 * />
 */
export const CreateSuccessDialog: FC<CreateSuccessDialogProps> = ({
  open,
  onClose,
  title,
  message,
  entityName,
  nextSteps = []
}) => {
  const navigate = useNavigate();

  const handleActionClick = (action: NextStepAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.path) {
      navigate(action.path);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {message}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {entityName}
          </Typography>
        </Alert>

        {nextSteps.length > 0 && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
              What would you like to do next?
            </Typography>
            <List disablePadding>
              {nextSteps.map((step, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleActionClick(step)}
                    sx={{
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: step.primary ? 'primary.main' : 'divider',
                      bgcolor: step.primary ? 'primary.lighter' : 'transparent',
                      '&:hover': {
                        bgcolor: step.primary ? 'primary.light' : 'action.hover',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: step.primary ? 'primary.main' : 'text.secondary' }}>
                      {step.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: step.primary ? 600 : 500 }}>
                          {step.label}
                        </Typography>
                      }
                      secondary={step.description}
                    />
                    <ArrowForwardIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
