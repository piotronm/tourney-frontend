import { describe, it, expect } from 'vitest';
import {
  getInitials,
  getLastName,
  getFirstName,
  getCombinedDupr,
  getAverageDupr,
  getDisplayRating,
  formatDuprRating,
  getPointDiffColor,
  formatPhoneNumber,
  sortPlayersByName,
  generateTeamName,
} from '../formatters';

describe('formatters', () => {
  describe('getInitials', () => {
    it('handles full names', () => {
      expect(getInitials('John Smith')).toBe('JS');
      expect(getInitials('Mary Jane Watson')).toBe('MW');
    });

    it('handles single word names', () => {
      expect(getInitials('Madonna')).toBe('MA');
      expect(getInitials('Cher')).toBe('CH');
    });

    it('handles hyphenated names', () => {
      expect(getInitials('Mary Smith-Jones')).toBe('MS');
      expect(getInitials("John O'Brien")).toBe('JO');
    });

    it('handles empty or invalid names', () => {
      expect(getInitials('')).toBe('??');
      expect(getInitials('   ')).toBe('??');
    });

    it('handles names with multiple spaces', () => {
      expect(getInitials('John   Smith')).toBe('JS');
    });
  });

  describe('getLastName', () => {
    it('extracts last name from full names', () => {
      expect(getLastName('John Smith')).toBe('Smith');
      expect(getLastName('Mary Jane Watson')).toBe('Watson');
    });

    it('handles single word names', () => {
      expect(getLastName('Madonna')).toBe('Madonna');
    });

    it('handles hyphenated names', () => {
      expect(getLastName('Bob Smith-Jones')).toBe('Smith-Jones');
    });

    it('handles empty names', () => {
      expect(getLastName('')).toBe('');
      expect(getLastName('   ')).toBe('');
    });
  });

  describe('getFirstName', () => {
    it('extracts first name', () => {
      expect(getFirstName('John Smith')).toBe('John');
      expect(getFirstName('Mary Jane Watson')).toBe('Mary');
    });

    it('handles single word names', () => {
      expect(getFirstName('Madonna')).toBe('Madonna');
    });

    it('handles empty names', () => {
      expect(getFirstName('')).toBe('');
    });
  });

  describe('getCombinedDupr', () => {
    it('calculates combined doubles rating by default', () => {
      const players = [
        { singlesRating: 4.5, doublesRating: 4.2 },
        { singlesRating: 3.8, doublesRating: 4.0 },
      ];
      expect(getCombinedDupr(players)).toBe(8.2);
    });

    it('calculates combined singles rating when specified', () => {
      const players = [
        { singlesRating: 4.5, doublesRating: 4.2 },
        { singlesRating: 3.8, doublesRating: 4.0 },
      ];
      expect(getCombinedDupr(players, true)).toBe(8.3);
    });

    it('handles null ratings', () => {
      const players = [
        { singlesRating: 4.5, doublesRating: null },
        { singlesRating: null, doublesRating: 4.0 },
      ];
      expect(getCombinedDupr(players)).toBe(4.0);
      expect(getCombinedDupr(players, true)).toBe(4.5);
    });

    it('returns 0 for empty array', () => {
      expect(getCombinedDupr([])).toBe(0);
    });
  });

  describe('getAverageDupr', () => {
    it('calculates average rating', () => {
      const players = [
        { singlesRating: 4.5, doublesRating: 4.0 },
        { singlesRating: 3.5, doublesRating: 4.0 },
      ];
      expect(getAverageDupr(players)).toBe(4.0);
    });

    it('returns null for empty array', () => {
      expect(getAverageDupr([])).toBeNull();
    });

    it('returns null when no ratings available', () => {
      const players = [
        { singlesRating: null, doublesRating: null },
      ];
      expect(getAverageDupr(players)).toBeNull();
    });
  });

  describe('formatDuprRating', () => {
    it('formats ratings to 1 decimal place', () => {
      expect(formatDuprRating(4.234)).toBe('4.2');
      expect(formatDuprRating(5)).toBe('5.0');
    });

    it('handles null and undefined', () => {
      expect(formatDuprRating(null)).toBe('N/A');
      expect(formatDuprRating(undefined)).toBe('N/A');
    });
  });

  describe('getPointDiffColor', () => {
    it('returns correct colors', () => {
      expect(getPointDiffColor(10)).toBe('success');
      expect(getPointDiffColor(-5)).toBe('error');
      expect(getPointDiffColor(0)).toBe('default');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats 10-digit numbers', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
    });

    it('formats already formatted numbers', () => {
      expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567');
    });

    it('handles 11-digit numbers with country code', () => {
      expect(formatPhoneNumber('15551234567')).toBe('+1 (555) 123-4567');
    });

    it('handles null and empty strings', () => {
      expect(formatPhoneNumber(null)).toBe('');
      expect(formatPhoneNumber('')).toBe('');
    });

    it('returns original for invalid formats', () => {
      expect(formatPhoneNumber('123')).toBe('123');
    });
  });

  describe('sortPlayersByName', () => {
    it('sorts by last name, then first name', () => {
      const players = [
        { id: 1, name: 'John Smith' },
        { id: 2, name: 'Alice Johnson' },
        { id: 3, name: 'Bob Smith' },
        { id: 4, name: 'Alice Smith' },
      ];

      const sorted = sortPlayersByName(players);

      expect(sorted[0].name).toBe('Alice Johnson');
      expect(sorted[1].name).toBe('Alice Smith');
      expect(sorted[2].name).toBe('Bob Smith');
      expect(sorted[3].name).toBe('John Smith');
    });

    it('does not mutate original array', () => {
      const players = [
        { id: 1, name: 'John Smith' },
        { id: 2, name: 'Alice Johnson' },
      ];

      const original = [...players];
      sortPlayersByName(players);

      expect(players).toEqual(original);
    });
  });

  describe('generateTeamName', () => {
    it('generates team names from player names', () => {
      expect(generateTeamName('John Smith', 'Mary Johnson')).toBe('Smith / Johnson');
    });

    it('handles single-word names', () => {
      expect(generateTeamName('Madonna', 'Bob Lee')).toBe('Madonna / Lee');
    });

    it('handles hyphenated names', () => {
      expect(generateTeamName('John Smith-Jones', 'Mary Davis')).toBe('Smith-Jones / Davis');
    });
  });
});
