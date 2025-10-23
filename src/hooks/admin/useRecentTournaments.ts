/**
 * useRecentTournaments Hook
 * Manages recently viewed tournaments in localStorage
 */

import { useState, useEffect } from 'react';

const RECENT_TOURNAMENTS_KEY = 'bracketiq_recent_tournaments';
const MAX_RECENT = 5;

export interface RecentTournament {
  id: number;
  name: string;
  lastViewedAt: string;
}

/**
 * Hook for managing recently viewed tournaments
 * Stores data in localStorage for persistence
 *
 * @returns Recent tournaments list and add function
 */
export const useRecentTournaments = () => {
  const [recentTournaments, setRecentTournaments] = useState<RecentTournament[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_TOURNAMENTS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentTournaments(parsed);
      } catch (error) {
        console.error('Failed to parse recent tournaments:', error);
        localStorage.removeItem(RECENT_TOURNAMENTS_KEY);
      }
    }
  }, []);

  /**
   * Add or update a tournament in recent list
   * @param id - Tournament ID
   * @param name - Tournament name
   */
  const addRecentTournament = (id: number, name: string) => {
    setRecentTournaments((prev) => {
      // Remove existing entry if present
      const filtered = prev.filter((t) => t.id !== id);

      // Add to front of list
      const updated = [
        { id, name, lastViewedAt: new Date().toISOString() },
        ...filtered
      ].slice(0, MAX_RECENT);

      // Persist to localStorage
      localStorage.setItem(RECENT_TOURNAMENTS_KEY, JSON.stringify(updated));

      return updated;
    });
  };

  /**
   * Clear all recent tournaments
   */
  const clearRecentTournaments = () => {
    setRecentTournaments([]);
    localStorage.removeItem(RECENT_TOURNAMENTS_KEY);
  };

  return {
    recentTournaments,
    addRecentTournament,
    clearRecentTournaments
  };
};
