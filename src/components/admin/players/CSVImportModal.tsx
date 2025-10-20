import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useCSVPreview, useCSVImport } from '@/hooks/admin/useCSVImport';
import { useQueryClient } from '@tanstack/react-query';

interface CSVImportModalProps {
  open: boolean;
  onClose: () => void;
}

type ImportStep = 'upload' | 'preview' | 'importing' | 'complete';

export function CSVImportModal({ open, onClose }: CSVImportModalProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);

  const queryClient = useQueryClient();
  const previewMutation = useCSVPreview();
  const importMutation = useCSVImport();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    try {
      const result = await previewMutation.mutateAsync(file);
      setPreviewData(result);
      setStep('preview');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setStep('importing');
    try {
      const result = await importMutation.mutateAsync(file);
      setImportResult(result);
      setStep('complete');

      // Invalidate players query to refresh list
      queryClient.invalidateQueries({ queryKey: ['players'] });
    } catch (error) {
      setStep('preview');
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setPreviewData(null);
    setImportResult(null);
    onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckIcon color="success" fontSize="small" />;
      case 'duplicate':
        return <WarningIcon color="warning" fontSize="small" />;
      case 'invalid':
        return <ErrorIcon color="error" fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Players from CSV</DialogTitle>

      <DialogContent>
        {/* Step 1: Upload */}
        {step === 'upload' && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload a CSV file with player data. The file should include columns for:
              Email, First Name, Last Name, Phone, DUPR ID, and DUPR Rating.
            </Typography>

            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
              }}
              onClick={() => document.getElementById('csv-file-input')?.click()}
            >
              <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                {file ? file.name : 'Click to select CSV file'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Maximum file size: 5MB
              </Typography>
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </Box>

            {file && (
              <Alert severity="info" sx={{ mt: 2 }}>
                File selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Alert>
            )}
          </Box>
        )}

        {/* Step 2: Preview */}
        {step === 'preview' && previewData && (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip
                icon={<CheckIcon />}
                label={`${previewData.validRows} Valid`}
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<WarningIcon />}
                label={`${previewData.duplicates} Duplicates`}
                color="warning"
                variant="outlined"
              />
              <Chip
                icon={<ErrorIcon />}
                label={`${previewData.invalidRows} Invalid`}
                color="error"
                variant="outlined"
              />
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>DUPR</TableCell>
                    <TableCell>Issues</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.preview.slice(0, 50).map((row: any) => (
                    <TableRow key={row.rowNumber}>
                      <TableCell>{row.rowNumber}</TableCell>
                      <TableCell>{getStatusIcon(row.status)}</TableCell>
                      <TableCell>
                        {row.data.firstName} {row.data.lastName}
                      </TableCell>
                      <TableCell>{row.data.email || '-'}</TableCell>
                      <TableCell>{row.data.duprRating || '-'}</TableCell>
                      <TableCell>
                        {row.errors.length > 0 && (
                          <Typography variant="caption" color="error">
                            {row.errors.join(', ')}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {previewData.preview.length > 50 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Showing first 50 of {previewData.totalRows} rows
              </Typography>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>Import will create {previewData.validRows} new players</AlertTitle>
              Duplicates and invalid rows will be skipped automatically.
            </Alert>
          </Box>
        )}

        {/* Step 3: Importing */}
        {step === 'importing' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Importing Players...
            </Typography>
            <LinearProgress sx={{ my: 3 }} />
            <Typography variant="body2" color="text.secondary">
              Please wait while we create the players in the database.
            </Typography>
          </Box>
        )}

        {/* Step 4: Complete */}
        {step === 'complete' && importResult && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Import Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Successfully imported {importResult.imported} players
              {importResult.skipped > 0 && (
                <>, skipped {importResult.skipped} duplicates</>
              )}
              {importResult.failed > 0 && (
                <>, {importResult.failed} failed</>
              )}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {step === 'upload' && (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handlePreview}
              disabled={!file || previewMutation.isPending}
            >
              {previewMutation.isPending ? 'Processing...' : 'Preview'}
            </Button>
          </>
        )}

        {step === 'preview' && (
          <>
            <Button onClick={() => setStep('upload')}>Back</Button>
            <Button
              variant="contained"
              onClick={handleImport}
              disabled={!previewData || previewData.validRows === 0}
            >
              Import {previewData?.validRows} Players
            </Button>
          </>
        )}

        {step === 'complete' && (
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
