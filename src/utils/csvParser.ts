import type { BulkImportTeam } from '@/types/team';

/**
 * Parse CSV file to team import data
 *
 * @param file - CSV file to parse
 * @returns Promise resolving to array of teams
 * @throws Error if CSV parsing fails
 */
export const parseCsvFile = (file: File): Promise<BulkImportTeam[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const teams = parseCsvText(text);
        resolve(teams);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read CSV file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Parse CSV text to team import data
 *
 * @param text - CSV text content
 * @returns Array of teams
 * @throws Error if CSV format is invalid
 */
export const parseCsvText = (text: string): BulkImportTeam[] => {
  const lines = text.trim().split('\n');

  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse header
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const nameIndex = header.indexOf('name');

  // Support both 'pool' and 'poolname' column names
  let poolIndex = header.indexOf('poolname');
  if (poolIndex === -1) {
    poolIndex = header.indexOf('pool');
  }

  // Support both 'seed' and 'poolseed' column names
  let seedIndex = header.indexOf('poolseed');
  if (seedIndex === -1) {
    seedIndex = header.indexOf('seed');
  }

  if (nameIndex === -1) {
    throw new Error('CSV must have a "name" column');
  }

  // Parse data rows
  const teams: BulkImportTeam[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = line.split(',').map(v => v.trim());
    const name = values[nameIndex];

    if (!name || name.length < 3) {
      errors.push(`Row ${i + 1}: Team name is required (min 3 characters)`);
      continue;
    }

    const team: BulkImportTeam = {
      name,
    };

    // Optional: Pool name
    if (poolIndex !== -1 && values[poolIndex]) {
      team.poolName = values[poolIndex];
    }

    // Optional: Pool seed
    if (seedIndex !== -1 && values[seedIndex]) {
      const seed = parseInt(values[seedIndex]);
      if (isNaN(seed) || seed < 1) {
        errors.push(`Row ${i + 1}: Invalid seed (must be positive integer)`);
        continue;
      }
      team.poolSeed = seed;
    }

    teams.push(team);
  }

  if (errors.length > 0) {
    throw new Error(`CSV validation errors:\n${errors.join('\n')}`);
  }

  if (teams.length === 0) {
    throw new Error('No valid teams found in CSV');
  }

  return teams;
};

/**
 * Generate example CSV content
 *
 * @returns Example CSV text
 */
export const getExampleCsv = (): string => {
  return `name,poolName,poolSeed
Team Alpha,Pool A,1
Team Bravo,Pool A,2
Team Charlie,Pool B,1
Team Delta,Pool B,2
Team Echo,Pool C,1
Team Foxtrot,Pool C,2

# Note: Pools will be created automatically if they don't exist
# Pool names are case-insensitive (Pool A = pool a)
# Column names: use 'poolName' (or 'pool') and 'poolSeed' (or 'seed')`;
};

/**
 * Download example CSV file
 */
export const downloadExampleCsv = (): void => {
  const csv = getExampleCsv();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'teams-example.csv';
  a.click();
  URL.revokeObjectURL(url);
};
