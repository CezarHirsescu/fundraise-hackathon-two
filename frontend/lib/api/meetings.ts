import apiClient, { extractData } from "./client"
import type {
	ApiResponse,
	Meeting,
	MeetingStats,
	CreateMeetingData,
	UpdateMeetingData,
	MeetingFilters,
} from "@/types/api"

/**
 * Get all meetings with optional filters
 */
export async function getMeetings(
	filters?: MeetingFilters
): Promise<Meeting[]> {
	const response = await apiClient.get<ApiResponse<Meeting[]>>("/meetings", {
		params: filters,
	})
	return extractData(response.data)
}

/**
 * Get a single meeting by ID
 */
export async function getMeetingById(id: string): Promise<Meeting> {
	const response = await apiClient.get<ApiResponse<Meeting>>(
		`/meetings/${id}`
	)
	return extractData(response.data)
}

/**
 * Create a new meeting
 */
export async function createMeeting(
	data: CreateMeetingData
): Promise<Meeting> {
	const response = await apiClient.post<ApiResponse<Meeting>>(
		"/meetings",
		data
	)
	return extractData(response.data)
}

/**
 * Update an existing meeting
 */
export async function updateMeeting(
	id: string,
	data: UpdateMeetingData
): Promise<Meeting> {
	const response = await apiClient.patch<ApiResponse<Meeting>>(
		`/meetings/${id}`,
		data
	)
	return extractData(response.data)
}

/**
 * Delete a meeting
 */
export async function deleteMeeting(id: string): Promise<void> {
	const response = await apiClient.delete<ApiResponse<void>>(
		`/meetings/${id}`
	)
	extractData(response.data)
}

/**
 * Process a meeting (generate summary and extract action items)
 */
export async function processMeeting(id: string): Promise<Meeting> {
	const response = await apiClient.post<ApiResponse<Meeting>>(
		`/meetings/${id}/process`
	)
	return extractData(response.data)
}

/**
 * Get meeting statistics
 */
export async function getMeetingStats(): Promise<MeetingStats> {
	const response = await apiClient.get<ApiResponse<MeetingStats>>(
		"/meetings/stats"
	)
	return extractData(response.data)
}

