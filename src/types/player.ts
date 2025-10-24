/**
 * Player type definitions
 * Used across the Player Management UI
 *
 * Migration note (2025-10-23): Updated to use single name field and separate ratings.
 * firstName/lastName are deprecated but kept for backward compatibility.
 */

/**
 * Player entity with new schema (single name field, separate ratings)
 *
 * Migration note: firstName/lastName are deprecated but kept for
 * backward compatibility with cached API responses
 */
export interface Player {
  id: number;

  /** Full name (e.g., "John Smith") - NEW field */
  name: string;

  email: string | null;
  duprId: string | null;

  /** DUPR singles rating (1.0-7.0) - NEW field */
  singlesRating: number | null;

  /** DUPR doubles rating (1.0-7.0) - NEW field */
  doublesRating: number | null;

  /**
   * Legacy computed rating field - kept for backward compatibility
   * Typically equals doublesRating for doubles divisions
   */
  duprRating: number | null;

  duprRatingUpdatedAt: string | null;

  /** Phone number - NEW field */
  phone: string | null;

  createdAt: string;
  updatedAt: string;

  // DEPRECATED - May exist in old cached responses, do NOT use in new code
  /** @deprecated Use 'name' field instead */
  firstName?: string;
  /** @deprecated Use 'name' field instead */
  lastName?: string;
}

/**
 * Request body for creating a new player
 */
export interface CreatePlayerInput {
  name: string;
  email?: string | null;
  duprId?: string | null;
  singlesRating?: number | null;
  doublesRating?: number | null;
  phone?: string | null;
}

/**
 * Request body for updating a player (all fields optional)
 */
export interface UpdatePlayerInput extends Partial<CreatePlayerInput> {}

export interface PlayersListResponse {
  data: Player[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
