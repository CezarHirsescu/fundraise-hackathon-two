"use client"

import { useState, useMemo } from "react"
import {
	Search,
	CheckCircle2,
	Circle,
	ChevronDown,
	Check,
	ClipboardList,
	CircleDashed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ActionItemDetail } from "@/components/actionItem"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { useActionItems, useUpdateActionItem } from "@/hooks/useActionItems"
import type { ActionItem } from "@/types/api"

type Priority = "High" | "Medium" | "Low"
type Status = "To Do" | "Pending" | "Completed"

export default function ActionItemsDashboard() {
	const [searchQuery, setSearchQuery] = useState("")
	const [priorityFilter, setPriorityFilter] = useState<string>("all")
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [meetingFilter, setMeetingFilter] = useState<string>("all")
	const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null)

	// Fetch action items from API
	const { data: actionItems, isLoading, error } = useActionItems()
	const updateMutation = useUpdateActionItem()

	// Filter action items
	const filteredItems = useMemo(() => {
		if (!actionItems) return []
		return actionItems.filter((item) => {
			const matchesSearch =
				item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(item.assignee?.toLowerCase() || "").includes(
					searchQuery.toLowerCase()
				) ||
				(item.meetingTitle?.toLowerCase() || "").includes(
					searchQuery.toLowerCase()
				)
			const matchesPriority =
				priorityFilter === "all" || item.priority === priorityFilter
			const matchesStatus =
				statusFilter === "all" || item.status === statusFilter
			const matchesMeeting =
				meetingFilter === "all" || item.meetingTitle === meetingFilter
			return matchesSearch && matchesPriority && matchesStatus && matchesMeeting
		})
	}, [actionItems, searchQuery, priorityFilter, statusFilter, meetingFilter])

	// Get unique meetings for filter
	const meetings = useMemo(() => {
		if (!actionItems) return []
		return Array.from(
			new Set(actionItems.map((item) => item.meetingTitle).filter(Boolean))
		) as string[]
	}, [actionItems])

	// Calculate stats
	const todoCount = actionItems?.filter((i) => i.status === "To Do").length || 0
	const pendingCount =
		actionItems?.filter((i) => i.status === "Pending").length || 0
	const completedCount =
		actionItems?.filter((i) => i.status === "Completed").length || 0
	const totalCount = actionItems?.length || 0

	const getPriorityColor = (priority: Priority) => {
		switch (priority) {
			case "High":
				return "bg-destructive/10 text-destructive border-destructive/20"
			case "Medium":
				return "bg-warning/10 text-warning border-warning/20"
			case "Low":
				return "bg-muted text-muted-foreground border-border"
		}
	}

	const updateStatus = (itemId: string, newStatus: Status) => {
		updateMutation.mutate({ id: itemId, data: { status: newStatus } })
	}

	if (isLoading) {
		return (
			<div className="min-h-screen min-w-full flex">
				<section className="flex-1 p-8">
					<div className="flex justify-center items-center py-12">
						<div className="text-muted-foreground">Loading action items...</div>
					</div>
				</section>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen min-w-full flex">
				<section className="flex-1 p-8">
					<div className="flex justify-center items-center py-12">
						<div className="text-red-500">
							Error loading action items. Please try again.
						</div>
					</div>
				</section>
			</div>
		)
	}

	return (
		<div className="min-h-screen min-w-full flex">
			<section className="flex-1 p-8">
				<div className="min-h-screen bg-background">
					<div className="mx-auto max-w-[1400px] p-6 lg:p-8">
						{/* Header */}
						<div className="mb-8">
							<h1 className="text-8xl font-semibold text-foreground mb-2 text-balance tracking-tighter">
								Tasks
							</h1>
							<p className="pl-4 text-muted-foreground">
								Organise your day, your way
							</p>
						</div>

						{/* Stats Cards */}
						<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<div className="rounded-lg border border-border bg-card p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground mb-1">
											Total Items
										</p>
										<p className="text-2xl font-semibold text-foreground">
											{totalCount}
										</p>
									</div>
									<div className="rounded-full bg-muted p-3">
										<ClipboardList className="h-5 w-5 text-muted-foreground" />
									</div>
								</div>
							</div>

							<div className="rounded-lg border border-border bg-card p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground mb-1">To Do</p>
										<p className="text-2xl font-semibold text-blue-500">
											{todoCount}
										</p>
									</div>
									<div className="rounded-full bg-blue-500/10 p-3">
										<CircleDashed className="h-5 w-5 text-blue-500" />
									</div>
								</div>
								<div className="mt-2 text-xs text-muted-foreground">
									{totalCount > 0 ? Math.round((todoCount / totalCount) * 100) : 0}
									% of total
								</div>
							</div>

							<div className="rounded-lg border border-border bg-card p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground mb-1">Pending</p>
										<p className="text-2xl font-semibold text-foreground">
											{pendingCount}
										</p>
									</div>
									<div className="rounded-full bg-muted p-3">
										<Circle className="h-5 w-5 text-muted-foreground" />
									</div>
								</div>
								<div className="mt-2 text-xs text-muted-foreground">
									{totalCount > 0
										? Math.round((pendingCount / totalCount) * 100)
										: 0}
									% of total
								</div>
							</div>

							<div className="rounded-lg border border-border bg-card p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground mb-1">
											Completed
										</p>
										<p className="text-2xl font-semibold text-success">
											{completedCount}
										</p>
									</div>
									<div className="rounded-full bg-success/10 p-3">
										<CheckCircle2 className="h-5 w-5 text-success" />
									</div>
								</div>
								<div className="mt-2 text-xs text-muted-foreground">
									{totalCount > 0
										? Math.round((completedCount / totalCount) * 100)
										: 0}
									% of total
								</div>
							</div>
						</div>

						{/* Filters */}
						<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
							<div className="relative flex-1 max-w-md">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search action items, assignees, or meetings..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-9 bg-card border-border"
								/>
							</div>

							<div className="flex flex-wrap gap-2">
								<Select value={meetingFilter} onValueChange={setMeetingFilter}>
									<SelectTrigger className="w-[180px] bg-card border-border">
										<SelectValue placeholder="All Meetings" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Meetings</SelectItem>
										{meetings.map((meeting) => (
											<SelectItem key={meeting} value={meeting}>
												{meeting}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select
									value={priorityFilter}
									onValueChange={setPriorityFilter}
								>
									<SelectTrigger className="w-[140px] bg-card border-border">
										<SelectValue placeholder="Priority" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Priorities</SelectItem>
										<SelectItem value="High">High</SelectItem>
										<SelectItem value="Medium">Medium</SelectItem>
										<SelectItem value="Low">Low</SelectItem>
									</SelectContent>
								</Select>

								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-[140px] bg-card border-border">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="To Do">To Do</SelectItem>
										<SelectItem value="Pending">Pending</SelectItem>
										<SelectItem value="Completed">Completed</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Table - Continued in next file due to 300 line limit */}
					</div>

					{/* Side Panel */}
					<ActionItemDetail
						item={selectedItem}
						onClose={() => setSelectedItem(null)}
					/>
				</div>
			</section>
		</div>
	)
}

