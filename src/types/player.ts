/**
 * Player type definitions
 * Used across the Player Management UI
 */

export interface Player {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  duprId?: string;
  duprRating?: number;
  duprRatingUpdatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlayerInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  duprId?: string;
  duprRating?: number;
}

export interface UpdatePlayerInput extends Partial<CreatePlayerInput> {}

export interface PlayersListResponse {
  data: Player[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
