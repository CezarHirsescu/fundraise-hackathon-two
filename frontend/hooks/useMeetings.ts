import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import {
	getMeetings,
	getMeetingById,
	createMeeting,
	updateMeeting,
	deleteMeeting,
	processMeeting,
	getMeetingStats,
} from "@/lib/api/meetings"
import type {
	Meeting,
	MeetingFilters,
	CreateMeetingData,
	UpdateMeetingData,
} from "@/types/api"

/**
 * Hook to fetch all meetings
 */
export function useMeetings(filters?: MeetingFilters) {
	return useQuery({
		queryKey: queryKeys.meetings.list(filters),
		queryFn: () => getMeetings(filters),
	})
}

/**
 * Hook to fetch a single meeting by ID
 */
export function useMeeting(id: string) {
	return useQuery({
		queryKey: queryKeys.meetings.detail(id),
		queryFn: () => getMeetingById(id),
		enabled: !!id, // Only run if ID is provided
	})
}

/**
 * Hook to fetch meeting statistics
 */
export function useMeetingStats() {
	return useQuery({
		queryKey: queryKeys.meetings.stats(),
		queryFn: getMeetingStats,
	})
}

/**
 * Hook to create a new meeting
 */
export function useCreateMeeting() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateMeetingData) => createMeeting(data),
		onSuccess: () => {
			// Invalidate meetings list to refetch
			queryClient.invalidateQueries({ queryKey: queryKeys.meetings.lists() })
			queryClient.invalidateQueries({ queryKey: queryKeys.meetings.stats() })
		},
	})
}

/**
 * Hook to update a meeting
 */
export function useUpdateMeeting() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateMeetingData }) =>
			updateMeeting(id, data),
		onSuccess: (updatedMeeting) => {
			// Invalidate specific meeting and lists
			queryClient.invalidateQueries({
				queryKey: queryKeys.meetings.detail(updatedMeeting._id),
			})
			queryClient.invalidateQueries({ queryKey: queryKeys.meetings.lists() })
			queryClient.invalidateQueries({ queryKey: queryKeys.meetings.stats() })
		},
	})
}

/**
 * Hook to delete a meeting
 */
export function useDeleteMeeting() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => deleteMeeting(id),
		onSuccess: (_, deletedId) => {
			// Remove from cache and invalidate lists
			queryClient.removeQueries({
				queryKey: queryKeys.meetings.detail(deletedId),
			})
			queryClient.invalidateQueries({ queryKey: queryKeys.meetings.lists() })
			queryClient.invalidateQueries({ queryKey: queryKeys.meetings.stats() })
		},
	})
}

/**
 * Hook to process a meeting (generate summary and action items)
 */
export function useProcessMeeting() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => processMeeting(id),
		onSuccess: (processedMeeting) => {
			// Invalidate meeting detail and action items
			queryClient.invalidateQueries({
				queryKey: queryKeys.meetings.detail(processedMeeting._id),
			})
			queryClient.invalidateQueries({ queryKey: queryKeys.meetings.lists() })
			queryClient.invalidateQueries({
				queryKey: queryKeys.actionItems.byMeeting(processedMeeting._id),
			})
			queryClient.invalidateQueries({
				queryKey: queryKeys.actionItems.lists(),
			})
		},
	})
}

