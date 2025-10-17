/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';

/**
 * Query configuration context for admin vs public users
 *
 * Admin users get immediate data refresh (staleTime: 0)
 * Public users get normal caching behavior (staleTime: 30s)
 */
interface QueryConfigContextValue {
  isAdmin: boolean;
  getQueryDefaults: () => {
    staleTime: number;
    gcTime: number;
    refetchOnWindowFocus: boolean;
  };
}

const QueryConfigContext = createContext<QueryConfigContextValue | undefined>(
  undefined
);

interface QueryConfigProviderProps {
  children: ReactNode;
  isAdmin?: boolean;
}

/**
 * Provider for query configuration context
 *
 * @param isAdmin - Whether the user is an admin (default: false)
 */
export function QueryConfigProvider({
  children,
  isAdmin = false,
}: QueryConfigProviderProps) {
  const getQueryDefaults = () => {
    if (isAdmin) {
      // Admin: Immediate refresh, short garbage collection
      return {
        staleTime: 0,
        gcTime: 60000, // 1 minute
        refetchOnWindowFocus: true,
      };
    }

    // Public: Normal caching behavior
    return {
      staleTime: 30000, // 30 seconds
      gcTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
    };
  };

  const value: QueryConfigContextValue = {
    isAdmin,
    getQueryDefaults,
  };

  return (
    <QueryConfigContext.Provider value={value}>
      {children}
    </QueryConfigContext.Provider>
  );
}

/**
 * Hook to access query configuration
 *
 * @throws Error if used outside QueryConfigProvider
 */
export function useQueryConfig() {
  const context = useContext(QueryConfigContext);

  if (context === undefined) {
    throw new Error(
      'useQueryConfig must be used within a QueryConfigProvider'
    );
  }

  return context;
}
