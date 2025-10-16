// User role enum
export type UserRole = 'ADMIN' | 'USER' | 'VIEWER';

// User object from backend
export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: UserRole;
}

// Auth context state
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Auth context methods
export interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isViewer: boolean;
  checkSession: () => Promise<void>;
}
