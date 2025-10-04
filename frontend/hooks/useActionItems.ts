import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
	getActionItems,
	getActionItemById,
	getActionItemsByMeeting,
	createActionItem,
	updateActionItem,
	deleteActionItem,
	getActionItemStats,
} from "@/lib/api/actionItems"
import type {
	ActionItem,
	ActionItemFilters,
	CreateActionItemData,
	UpdateActionItemData,
} from "@/types/api"

/**
 * Hook to fetch all action items
 */
export function useActionItems(filters?: ActionItemFilters) {
	return useQuery({
		queryKey: ["action-items", filters],
		queryFn: () => getActionItems(filters),
	})
}

/**
 * Hook to fetch a single action item by ID
 */
export function useActionItem(id: string) {
	return useQuery({
		queryKey: ["action-items", id],
		queryFn: () => getActionItemById(id),
		enabled: !!id, // Only run if ID is provided
	})
}

/**
 * Hook to fetch action items for a specific meeting
 */
export function useActionItemsByMeeting(meetingId: string) {
	return useQuery({
		queryKey: ["action-items", "meeting", meetingId],
		queryFn: () => getActionItemsByMeeting(meetingId),
		enabled: !!meetingId, // Only run if meetingId is provided
	})
}

/**
 * Hook to fetch action item statistics
 */
export function useActionItemStats(meetingId?: string) {
	return useQuery({
		queryKey: ["action-items", "stats", meetingId],
		queryFn: () => getActionItemStats(meetingId),
	})
}

/**
 * Hook to create a new action item
 */
export function useCreateActionItem() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: CreateActionItemData) => createActionItem(data),
		onSuccess: (newActionItem) => {
			// Invalidate action items lists and meeting-specific lists
			queryClient.invalidateQueries({
				queryKey: ["action-items"],
			})
		},
	})
}

/**
 * Hook to update an action item
 */
export function useUpdateActionItem() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateActionItemData }) =>
			updateActionItem(id, data),
		onSuccess: (updatedActionItem) => {
			// Invalidate specific action item and lists
			queryClient.invalidateQueries({
				queryKey: ["action-items", updatedActionItem._id],
			})
		},
	})
}

/**
 * Hook to delete an action item
 */
export function useDeleteActionItem() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => deleteActionItem(id),
		onSuccess: (_, deletedId) => {
			// Remove from cache and invalidate lists
			queryClient.removeQueries({
				queryKey: ["action-items"],
			})
		},
	})
}

