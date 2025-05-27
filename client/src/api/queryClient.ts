import { QueryClient } from "@tanstack/react-query";

// Create a client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Cache time: how long data stays in cache after component unmounts
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408 (timeout)
        if (error instanceof Error && error.message.includes("HTTP 4")) {
          if (error.message.includes("HTTP 408")) return failureCount < 3;
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
      // Retry delay for mutations
      retryDelay: 2000,
    },
  },
});

// Query key factory for consistent query keys
export const createQueryKey = {
  pitchDeck: (id: string, password?: string) => {
    const base = ["pitchDeck", id];
    return password ? [...base, password] : base;
  },
  pitchDecks: (filters?: Record<string, any>) => {
    const base = ["pitchDecks"];
    return filters ? [...base, filters] : base;
  },
  generation: (type: string, data?: any) => {
    const base = ["generation", type];
    return data ? [...base, data] : base;
  },
} as const;
