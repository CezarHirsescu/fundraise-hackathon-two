import type { MeetingFilters, ActionItemFilters } from "@/types/api"

/**
 * Centralized query key factory for React Query
 * This ensures consistent cache keys across the application
 */
export const queryKeys = {
	// Meeting keys
	meetings: {
		all: ["meetings"] as const,
		lists: () => [...queryKeys.meetings.all, "list"] as const,
		list: (filters?: MeetingFilters) =>
			[...queryKeys.meetings.lists(), filters] as const,
		details: () => [...queryKeys.meetings.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.meetings.details(), id] as const,
		stats: () => [...queryKeys.meetings.all, "stats"] as const,
	},

	// Action Item keys
	actionItems: {
		all: ["actionItems"] as const,
		lists: () => [...queryKeys.actionItems.all, "list"] as const,
		list: (filters?: ActionItemFilters) =>
			[...queryKeys.actionItems.lists(), filters] as const,
		details: () => [...queryKeys.actionItems.all, "detail"] as const,
		detail: (id: string) => [...queryKeys.actionItems.details(), id] as const,
		byMeeting: (meetingId: string) =>
			[...queryKeys.actionItems.all, "meeting", meetingId] as const,
		stats: (meetingId?: string) =>
			[...queryKeys.actionItems.all, "stats", meetingId] as const,
	},

	// Notetaker keys (for existing notetaker functionality)
	notetaker: {
		all: ["notetaker"] as const,
		sessions: () => [...queryKeys.notetaker.all, "sessions"] as const,
		session: (id: string) => [...queryKeys.notetaker.sessions(), id] as const,
	},
}

