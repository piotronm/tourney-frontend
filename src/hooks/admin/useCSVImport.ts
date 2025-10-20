import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface PreviewRow {
  rowNumber: number;
  status: 'valid' | 'duplicate' | 'invalid';
  data: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    duprId: string;
    duprRating: number | null;
  };
  errors: string[];
}

interface PreviewResponse {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicates: number;
  preview: PreviewRow[];
}

interface ImportResponse {
  imported: number;
  skipped: number;
  failed: number;
  details: {
    skippedRows: any[];
    failedRows: any[];
  };
}

async function previewCSV(file: File): Promise<PreviewResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/public';
  const apiUrl = API_BASE_URL.replace('/api/public', '/api');

  const response = await fetch(`${apiUrl}/players/import/preview`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to preview CSV');
  }

  return response.json();
}

async function executeImport(file: File): Promise<ImportResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/public';
  const apiUrl = API_BASE_URL.replace('/api/public', '/api');

  const response = await fetch(`${apiUrl}/players/import/execute`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to import CSV');
  }

  return response.json();
}

export function useCSVPreview() {
  return useMutation({
    mutationFn: previewCSV,
    onError: (error: Error) => {
      toast.error(`Preview failed: ${error.message}`);
    }
  });
}

export function useCSVImport() {
  return useMutation({
    mutationFn: executeImport,
    onSuccess: (data) => {
      const message = `Imported ${data.imported} players${
        data.skipped > 0 ? `, skipped ${data.skipped} duplicates` : ''
      }${data.failed > 0 ? `, ${data.failed} failed` : ''}`;
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(`Import failed: ${error.message}`);
    }
  });
}
