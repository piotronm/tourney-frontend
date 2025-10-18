import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['G', 'D'], description: 'Go to Dashboard', category: 'Navigation' },
  { keys: ['G', 'V'], description: 'Go to Divisions', category: 'Navigation' },
  { keys: ['G', 'T'], description: 'Go to Teams', category: 'Navigation' },
  { keys: ['G', 'P'], description: 'Go to Pools', category: 'Navigation' },
  { keys: ['G', 'M'], description: 'Go to Matches', category: 'Navigation' },

  // Actions
  { keys: ['N'], description: 'New Division (on divisions page)', category: 'Actions' },
  { keys: ['⌘/Ctrl', 'K'], description: 'Search', category: 'Actions' },

  // Help
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Help' },
];

const categories = Array.from(new Set(shortcuts.map(s => s.category)));

function KeyChip({ keyLabel }: { keyLabel: string }) {
  return (
    <Chip
      label={keyLabel}
      size="small"
      sx={{
        fontFamily: 'monospace',
        fontWeight: 600,
        mr: 0.5,
        backgroundColor: 'grey.200',
        color: 'text.primary',
      }}
    />
  );
}

export function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Keyboard Shortcuts</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Use these keyboard shortcuts to navigate faster through the admin panel.
        </Typography>

        {categories.map((category, index) => (
          <Box key={category}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              {category}
            </Typography>

            <Table size="small" sx={{ mb: 3 }}>
              <TableBody>
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ border: 0, py: 1, pl: 0, width: '40%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {shortcut.keys.map((key, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                              <KeyChip keyLabel={key} />
                              {i < shortcut.keys.length - 1 && (
                                <Typography variant="caption" sx={{ mx: 0.5 }}>
                                  then
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ border: 0, py: 1 }}>
                        <Typography variant="body2">{shortcut.description}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {index < categories.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            💡 Tip: Press <KeyChip keyLabel="?" /> at any time to see this dialog.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
