import type { FC } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { parseCsvFile, downloadExampleCsv } from '@/utils/csvParser';
import type { BulkImportTeam } from '@/types/team';

interface BulkImportTeamsDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (teams: BulkImportTeam[]) => void;
  isImporting?: boolean;
}

/**
 * Bulk import teams dialog
 * Allows uploading CSV file with team data
 *
 * Features:
 * - File upload
 * - CSV parsing and validation
 * - Preview parsed teams
 * - Download example CSV
 * - Error handling
 */
export const BulkImportTeamsDialog: FC<BulkImportTeamsDialogProps> = ({
  open,
  onClose,
  onImport,
  isImporting = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [teams, setTeams] = useState<BulkImportTeam[]>([]);
  const [error, setError] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    setIsParsing(true);

    try {
      const parsedTeams = await parseCsvFile(selectedFile);
      setTeams(parsedTeams);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
      setTeams([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = () => {
    if (teams.length > 0) {
      onImport(teams);
    }
  };

  const handleClose = () => {
    setFile(null);
    setTeams([]);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Bulk Import Teams</DialogTitle>

      <DialogContent>
        {/* Instructions */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>CSV Format:</strong>
          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
            <li><strong>name</strong> - Required, 3-50 characters</li>
            <li><strong>pool</strong> - Optional, pool name (e.g., "Pool A", "Pool B")
              <ul style={{ marginTop: '2px', paddingLeft: '20px' }}>
                <li>✨ Pools will be auto-created if they don't exist!</li>
                <li>🔄 Case-insensitive matching (Pool A = pool a = POOL A)</li>
              </ul>
            </li>
            <li><strong>seed</strong> - Optional, positive integer for pool seeding</li>
          </ul>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            💡 <strong>Tips:</strong> You don't need to create pools before importing! Pool names from CSV will be created automatically. Existing pools will be matched case-insensitively.
          </Typography>
        </Alert>

        {/* Download Example */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={downloadExampleCsv}
          >
            Download Example CSV
          </Button>
        </Box>

        {/* File Upload */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            disabled={isImporting || isParsing}
          >
            {file ? 'Change File' : 'Upload CSV File'}
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {file.name}
            </Typography>
          )}
        </Box>

        {/* Parsing Progress */}
        {isParsing && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Parsing CSV...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {error}
          </Alert>
        )}

        {/* Preview Teams */}
        {teams.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Preview ({teams.length} teams):
            </Typography>
            <List
              dense
              sx={{
                maxHeight: 300,
                overflow: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              {teams.map((team, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={team.name}
                    secondary={
                      team.poolName
                        ? `Pool: ${team.poolName}${
                            team.poolSeed ? `, Seed: ${team.poolSeed}` : ''
                          }`
                        : 'No pool assigned'
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isImporting}>
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={teams.length === 0 || isImporting}
        >
          {isImporting ? 'Importing...' : `Import ${teams.length} Teams`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
