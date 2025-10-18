/**
 * Escapes a CSV field by wrapping it in quotes if it contains special characters
 */
function escapeCsvField(field: string | number | null | undefined): string {
  if (field === null || field === undefined) {
    return '';
  }

  const stringField = String(field);

  // If field contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }

  return stringField;
}

/**
 * Converts an array of objects to CSV format
 */
export function convertToCsv<T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) {
    return '';
  }

  // Create header row
  const headerRow = headers.map(h => escapeCsvField(h.label)).join(',');

  // Create data rows
  const dataRows = data.map(row =>
    headers.map(h => escapeCsvField(row[h.key])).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Downloads CSV content as a file
 */
export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Exports data to CSV and triggers download
 */
export function exportToCsv<T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T; label: string }[],
  filename: string
): void {
  const csv = convertToCsv(data, headers);
  downloadCsv(csv, filename);
}
