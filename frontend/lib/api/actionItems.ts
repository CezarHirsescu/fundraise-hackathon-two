import apiClient, { extractData } from "./client"
import type {
	ApiResponse,
	ActionItem,
	ActionItemStats,
	CreateActionItemData,
	UpdateActionItemData,
	ActionItemFilters,
} from "@/types/api"

/**
 * Get all action items with optional filters
 */
export async function getActionItems(
	filters?: ActionItemFilters
): Promise<ActionItem[]> {
	const response = await apiClient.get<ApiResponse<ActionItem[]>>(
		"/action-items",
		{
			params: filters,
		}
	)
	return extractData(response.data)
}

/**
 * Get a single action item by ID
 */
export async function getActionItemById(id: string): Promise<ActionItem> {
	const response = await apiClient.get<ApiResponse<ActionItem>>(
		`/action-items/${id}`
	)
	return extractData(response.data)
}

/**
 * Get all action items for a specific meeting
 */
export async function getActionItemsByMeeting(
	meetingId: string
): Promise<ActionItem[]> {
	const response = await apiClient.get<ApiResponse<ActionItem[]>>(
		`/action-items/meeting/${meetingId}`
	)
	return extractData(response.data)
}

/**
 * Create a new action item
 */
export async function createActionItem(
	data: CreateActionItemData
): Promise<ActionItem> {
	const response = await apiClient.post<ApiResponse<ActionItem>>(
		"/action-items",
		data
	)
	return extractData(response.data)
}

/**
 * Update an existing action item
 */
export async function updateActionItem(
	id: string,
	data: UpdateActionItemData
): Promise<ActionItem> {
	const response = await apiClient.patch<ApiResponse<ActionItem>>(
		`/action-items/${id}`,
		data
	)
	return extractData(response.data)
}

/**
 * Delete an action item
 */
export async function deleteActionItem(id: string): Promise<void> {
	const response = await apiClient.delete<ApiResponse<void>>(
		`/action-items/${id}`
	)
	extractData(response.data)
}

/**
 * Get action item statistics
 */
export async function getActionItemStats(
	meetingId?: string
): Promise<ActionItemStats> {
	const response = await apiClient.get<ApiResponse<ActionItemStats>>(
		"/action-items/stats",
		{
			params: meetingId ? { meetingId } : undefined,
		}
	)
	return extractData(response.data)
}

