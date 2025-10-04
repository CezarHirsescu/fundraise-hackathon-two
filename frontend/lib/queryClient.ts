import { QueryClient } from "@tanstack/react-query"

/**
 * Create and configure React Query client
 */
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Stale time: how long data is considered fresh (5 minutes)
			staleTime: 5 * 60 * 1000,
			// Cache time: how long inactive data stays in cache (10 minutes)
			gcTime: 10 * 60 * 1000,
			// Retry failed requests
			retry: 1,
			// Refetch on window focus
			refetchOnWindowFocus: false,
			// Refetch on reconnect
			refetchOnReconnect: true,
		},
		mutations: {
			// Retry failed mutations
			retry: 0,
		},
	},
})

