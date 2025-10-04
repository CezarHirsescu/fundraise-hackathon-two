// API Response Types
export interface ApiResponse<T> {
	success: boolean
	data?: T
	message?: string
	error?: string
	count?: number
}

// Meeting Types
export interface Meeting {
	_id: string
	title: string
	date: string // ISO date string
	duration: number // in minutes
	transcriptUrl?: string
	transcriptText?: string
	summary?: string
	participants: string[] // NEW: array of participant names
	actionItems: string[] // array of action item IDs
	notetakerId?: string
	status: "pending" | "processing" | "completed" | "failed"
	createdAt: string
	updatedAt: string
}

export interface MeetingStats {
	total: number
	pending: number
	processing: number
	completed: number
	failed: number
}

export interface CreateMeetingData {
	title: string
	date: string
	duration: number
	transcriptUrl?: string
	transcriptText?: string
	notetakerId?: string
}

export interface UpdateMeetingData {
	title?: string
	date?: string
	duration?: number
	transcriptUrl?: string
	transcriptText?: string
	summary?: string
	participants?: string[]
	status?: "pending" | "processing" | "completed" | "failed"
}

// Action Item Types
export interface ActionItem {
	_id: string
	meetingId: string | Meeting // Can be populated
	text: string
	priority: "High" | "Medium" | "Low"
	status: "To Do" | "Pending" | "Completed" // NEW: includes "To Do"
	dueDate?: string // ISO date string
	assignee?: string
	createdAt: string
	updatedAt: string
	// Additional fields when populated
	meetingTitle?: string
	meetingDate?: string
}

export interface ActionItemStats {
	total: number
	toDo: number // NEW
	pending: number
	completed: number
	high: number
	medium: number
	low: number
}

export interface CreateActionItemData {
	meetingId: string
	text: string
	priority: "High" | "Medium" | "Low"
	status?: "To Do" | "Pending" | "Completed"
	dueDate?: string
	assignee?: string
}

export interface UpdateActionItemData {
	text?: string
	priority?: "High" | "Medium" | "Low"
	status?: "To Do" | "Pending" | "Completed"
	dueDate?: string
	assignee?: string
}

// Filters
export interface MeetingFilters {
	status?: "pending" | "processing" | "completed" | "failed"
	startDate?: string
	endDate?: string
}

export interface ActionItemFilters {
	priority?: "High" | "Medium" | "Low"
	status?: "To Do" | "Pending" | "Completed"
	meetingId?: string
	dueDateBefore?: string
	dueDateAfter?: string
}

