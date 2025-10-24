/**
 * Utility functions for formatting player names, ratings, and team data
 *
 * Migration note (2025-10-23): Added functions to handle new single-name field schema
 * and separate ratings. These functions provide consistent formatting across the application.
 */

import { format } from 'date-fns';

// ============================================
// DATE FORMATTERS (EXISTING)
// ============================================

export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy h:mm a');
  } catch {
    return 'Invalid date';
  }
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

// ============================================
// PLAYER NAME UTILITIES (NEW - 2025-10-23)
// ============================================

/**
 * Extract initials from a full name for avatar display
 *
 * @param name - Full name (e.g., "John Smith")
 * @returns Two-letter initials (e.g., "JS")
 *
 * @example
 * getInitials("John Smith") // "JS"
 * getInitials("Mary") // "MA"
 * getInitials("Bob Smith-Jones") // "BS"
 * getInitials("") // "??"
 */
export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return '??';
  }

  const trimmed = name.trim();
  const parts = trimmed.split(' ').filter(part => part.length > 0);

  if (parts.length === 0) {
    return '??';
  }

  if (parts.length === 1) {
    // Single word name - use first 2 letters
    return trimmed.substring(0, 2).toUpperCase();
  }

  // Multiple words - use first letter of first and last word
  const firstInitial = parts[0][0];
  const lastInitial = parts[parts.length - 1][0];
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

/**
 * Extract last name from full name for display or sorting
 *
 * @param name - Full name (e.g., "John Smith")
 * @returns Last name (e.g., "Smith")
 *
 * @example
 * getLastName("John Smith") // "Smith"
 * getLastName("Mary") // "Mary"
 * getLastName("Bob Smith-Jones") // "Smith-Jones"
 */
export function getLastName(name: string): string {
  if (!name || name.trim().length === 0) {
    return '';
  }

  const parts = name.trim().split(' ').filter(part => part.length > 0);

  if (parts.length === 0) {
    return '';
  }

  return parts[parts.length - 1];
}

/**
 * Extract first name from full name
 *
 * @param name - Full name (e.g., "John Smith")
 * @returns First name (e.g., "John")
 *
 * @example
 * getFirstName("John Smith") // "John"
 * getFirstName("Mary") // "Mary"
 */
export function getFirstName(name: string): string {
  if (!name || name.trim().length === 0) {
    return '';
  }

  const parts = name.trim().split(' ').filter(part => part.length > 0);

  if (parts.length === 0) {
    return '';
  }

  return parts[0];
}

// ============================================
// DUPR RATING UTILITIES (NEW - 2025-10-23)
// ============================================

/**
 * Calculate combined DUPR rating for a team
 *
 * Uses doubles rating by default (most common), singles rating if division
 * is singles format. Returns 0 if no players or no ratings available.
 *
 * @param players - Array of team players
 * @param isSingles - Whether division is singles format (default: false)
 * @returns Combined DUPR rating
 *
 * @example
 * const players = [
 *   { singlesRating: 4.5, doublesRating: 4.2 },
 *   { singlesRating: 3.8, doublesRating: 4.0 }
 * ];
 * getCombinedDupr(players) // 8.2 (4.2 + 4.0)
 * getCombinedDupr(players, true) // 8.3 (4.5 + 3.8)
 */
export function getCombinedDupr(
  players: Array<{ singlesRating?: number | null; doublesRating?: number | null }>,
  isSingles = false
): number {
  if (!players || players.length === 0) {
    return 0;
  }

  return players.reduce((sum, player) => {
    const rating = isSingles
      ? (player.singlesRating || 0)
      : (player.doublesRating || 0);
    return sum + rating;
  }, 0);
}

/**
 * Get average DUPR rating for a team
 *
 * @param players - Array of team players
 * @param isSingles - Whether division is singles format (default: false)
 * @returns Average DUPR rating, or null if no ratings
 */
export function getAverageDupr(
  players: Array<{ singlesRating?: number | null; doublesRating?: number | null }>,
  isSingles = false
): number | null {
  if (!players || players.length === 0) {
    return null;
  }

  const total = getCombinedDupr(players, isSingles);
  const count = players.filter(p => {
    const rating = isSingles ? p.singlesRating : p.doublesRating;
    return rating !== null && rating !== undefined;
  }).length;

  if (count === 0) {
    return null;
  }

  return total / count;
}

/**
 * Get display rating for a player based on division format
 *
 * @param player - Player with ratings
 * @param isSingles - Whether division is singles format (default: false)
 * @returns Rating to display
 *
 * @example
 * const player = { singlesRating: 4.5, doublesRating: 4.2 };
 * getDisplayRating(player) // 4.2 (doubles)
 * getDisplayRating(player, true) // 4.5 (singles)
 */
export function getDisplayRating(
  player: { singlesRating?: number | null; doublesRating?: number | null },
  isSingles = false
): number | null {
  const rating = isSingles ? player.singlesRating : player.doublesRating;
  return rating ?? null;
}

/**
 * Format a DUPR rating for display with consistent decimal places
 *
 * @param rating - DUPR rating value
 * @returns Formatted string (e.g., "4.2") or "N/A" if null
 *
 * @example
 * formatDuprRating(4.234) // "4.2"
 * formatDuprRating(null) // "N/A"
 * formatDuprRating(undefined) // "N/A"
 */
export function formatDuprRating(rating: number | null | undefined): string {
  if (rating == null) {
    return 'N/A';
  }
  return rating.toFixed(1);
}

// ============================================
// UI UTILITIES (NEW - 2025-10-23)
// ============================================

/**
 * Get MUI color for point differential display
 *
 * @param diff - Point differential value
 * @returns MUI color name for Chip or other components
 *
 * @example
 * getPointDiffColor(10) // 'success' (green)
 * getPointDiffColor(-5) // 'error' (red)
 * getPointDiffColor(0) // 'default' (gray)
 */
export function getPointDiffColor(diff: number): 'success' | 'error' | 'default' {
  if (diff > 0) return 'success';
  if (diff < 0) return 'error';
  return 'default';
}

/**
 * Format a phone number for display
 *
 * @param phone - Raw phone number string
 * @returns Formatted phone number or empty string
 *
 * @example
 * formatPhoneNumber("5551234567") // "(555) 123-4567"
 * formatPhoneNumber("555-123-4567") // "(555) 123-4567"
 * formatPhoneNumber(null) // ""
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) {
    return '';
  }

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format based on length
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Return original if can't format
  return phone;
}

// ============================================
// SORTING & TEAM UTILITIES (NEW - 2025-10-23)
// ============================================

/**
 * Sort players by last name, then first name
 *
 * @param players - Array of players to sort
 * @returns Sorted array (does not mutate original)
 *
 * @example
 * const players = [
 *   { name: "John Smith" },
 *   { name: "Alice Johnson" },
 *   { name: "Bob Smith" }
 * ];
 * sortPlayersByName(players)
 * // [{ name: "Alice Johnson" }, { name: "Bob Smith" }, { name: "John Smith" }]
 */
export function sortPlayersByName<T extends { name: string }>(players: T[]): T[] {
  return [...players].sort((a, b) => {
    const aLast = getLastName(a.name);
    const bLast = getLastName(b.name);

    // Compare last names first
    if (aLast !== bLast) {
      return aLast.localeCompare(bLast);
    }

    // If last names are equal, compare first names
    const aFirst = getFirstName(a.name);
    const bFirst = getFirstName(b.name);
    return aFirst.localeCompare(bFirst);
  });
}

/**
 * Generate a team name from two player names
 *
 * @param player1Name - First player's full name
 * @param player2Name - Second player's full name
 * @returns Team name in format "LastName1 / LastName2"
 *
 * @example
 * generateTeamName("John Smith", "Mary Johnson") // "Smith / Johnson"
 * generateTeamName("Madonna", "Bob Lee") // "Madonna / Lee"
 */
export function generateTeamName(player1Name: string, player2Name: string): string {
  const lastName1 = getLastName(player1Name);
  const lastName2 = getLastName(player2Name);
  return `${lastName1} / ${lastName2}`;
}
