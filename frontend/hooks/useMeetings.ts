import { useQuery } from "@tanstack/react-query"
import {
	getMeetings,
	getMeetingById,
} from "@/lib/api/meetings"

/**
 * Hook to fetch all meetings
 */
export function useMeetings() {
	return useQuery({
		queryKey: ["meetings"],
		queryFn: () => getMeetings(),
	})
}

/**
 * Hook to fetch a single meeting by ID
 */
export function useMeeting(id: string) {
	return useQuery({
		queryKey: ["meetings", id],
		queryFn: () => getMeetingById(id),
		enabled: !!id, // Only run if ID is provided
	})
}
