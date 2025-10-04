"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Search, CheckCircle2, Circle, MoreHorizontal, ChevronDown, Check, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ActionItemDetail } from "@/components/actionItem"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CircleDashed } from "lucide-react"

type Priority = "High" | "Medium" | "Low"
type Status = "To Do" | "Pending" | "Done"

interface ActionItem {
    id: string
    title: string
    meeting: string
    priority: Priority
    status: Status
    dueDate: string
    assignee: string
    meetingDate: string
    context: string
}

const mockActionItems: ActionItem[] = [
    {
        id: "1",
        title: "Review Q4 budget proposal and provide feedback",
        meeting: "Q4 Planning Meeting",
        priority: "High",
        status: "Pending",
        dueDate: "2025-10-10",
        assignee: "Sarah Chen",
        meetingDate: "2025-10-01",
        context:
            "Discussed budget allocation for Q4 initiatives. Need to review the proposed $2M budget and provide feedback on resource distribution.",
    },
    {
        id: "2",
        title: "Update API documentation for v2.0 release",
        meeting: "Engineering Sync",
        priority: "High",
        status: "Pending",
        dueDate: "2025-10-08",
        assignee: "Alex Kumar",
        meetingDate: "2025-10-02",
        context: "API v2.0 is launching next week. Documentation needs to reflect new endpoints and deprecation notices.",
    },
    {
        id: "3",
        title: "Schedule follow-up with design team",
        meeting: "Product Review",
        priority: "Medium",
        status: "Done",
        dueDate: "2025-10-05",
        assignee: "Jordan Lee",
        meetingDate: "2025-09-28",
        context: "Design team presented new mockups. Need to schedule a follow-up to discuss implementation details.",
    },
    {
        id: "4",
        title: "Prepare demo for client presentation",
        meeting: "Sales Strategy",
        priority: "High",
        status: "Pending",
        dueDate: "2025-10-12",
        assignee: "Morgan Taylor",
        meetingDate: "2025-10-03",
        context:
            "Client presentation scheduled for next Friday. Need to prepare a comprehensive demo showcasing new features.",
    },
    {
        id: "5",
        title: "Review security audit findings",
        meeting: "Security Review",
        priority: "High",
        status: "Pending",
        dueDate: "2025-10-07",
        assignee: "Sarah Chen",
        meetingDate: "2025-10-01",
        context: "External security audit completed. Need to review findings and create remediation plan.",
    },
    {
        id: "6",
        title: "Update onboarding documentation",
        meeting: "HR Sync",
        priority: "Low",
        status: "Pending",
        dueDate: "2025-10-15",
        assignee: "Alex Kumar",
        meetingDate: "2025-09-30",
        context: "New hires reported confusion with current onboarding docs. Need to update and clarify processes.",
    },
    {
        id: "7",
        title: "Coordinate with marketing on launch campaign",
        meeting: "Product Launch Planning",
        priority: "Medium",
        status: "Pending",
        dueDate: "2025-10-11",
        assignee: "Jordan Lee",
        meetingDate: "2025-10-02",
        context:
            "Product launch scheduled for end of month. Need to align with marketing on campaign messaging and timeline.",
    },
    {
        id: "8",
        title: "Set up monitoring for new infrastructure",
        meeting: "DevOps Weekly",
        priority: "Medium",
        status: "Done",
        dueDate: "2025-10-04",
        assignee: "Morgan Taylor",
        meetingDate: "2025-09-27",
        context: "New infrastructure deployed to production. Monitoring and alerting need to be configured.",
    },
]

const availableAssignees = [
    "Sarah Chen",
    "Alex Kumar",
    "Jordan Lee",
    "Morgan Taylor",
    "Casey Williams",
    "Riley Martinez",
    "Quinn Anderson",
]

export default function ActionItemsDashboard() {
    const [searchQuery, setSearchQuery] = useState("")
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [meetingFilter, setMeetingFilter] = useState<string>("all")
    const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null)
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
    const [actionItems, setActionItems] = useState<ActionItem[]>(mockActionItems)

    const filteredItems = actionItems.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.meeting.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter
        const matchesStatus = statusFilter === "all" || item.status === statusFilter
        const matchesMeeting = meetingFilter === "all" || item.meeting === meetingFilter
        return matchesSearch && matchesPriority && matchesStatus && matchesMeeting
    })

    const meetings = Array.from(new Set(actionItems.map((item) => item.meeting)))

    const todoCount = actionItems.filter((i) => i.status === "To Do").length
    const pendingCount = actionItems.filter((i) => i.status === "Pending").length
    const completedCount = actionItems.filter((i) => i.status === "Done").length
    const totalCount = actionItems.length

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

    const toggleItemSelection = (id: string) => {
        const newSelected = new Set(selectedItems)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedItems(newSelected)
    }

    const toggleAllItems = () => {
        if (selectedItems.size === filteredItems.length) {
            setSelectedItems(new Set())
        } else {
            setSelectedItems(new Set(filteredItems.map((item) => item.id)))
        }
    }

    const bulkMarkDone = () => {
        console.log("Marking items as done:", Array.from(selectedItems))
        setSelectedItems(new Set())
    }

    const updateAssignee = (itemId: string, newAssignee: string) => {
        setActionItems((items) => items.map((item) => (item.id === itemId ? { ...item, assignee: newAssignee } : item)))
    }

    const updateStatus = (itemId: string, newStatus: Status) => {
        setActionItems((items) => items.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item)))
    }
    return (
        <div className='min-h-screen min-w-full flex'>
            <aside className='w-36 bg-gray-50 shadow-2xs p-6'>
                <Navbar />
            </aside>
            <section className='flex-1 p-8'>
                <div className="min-h-screen bg-background">
                    <div className="mx-auto max-w-[1400px] p-6 lg:p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-8xl font-semibold text-foreground mb-2 text-balance tracking-tighter">Tasks</h1>
                            <p className="pl-4 text-muted-foreground">Organise your day, your way</p>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg border border-border bg-card p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                                        <p className="text-2xl font-semibold text-foreground">{totalCount}</p>
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
                                        <p className="text-2xl font-semibold text-blue-500">{todoCount}</p>
                                    </div>
                                    <div className="rounded-full bg-blue-500/10 p-3">
                                        <CircleDashed className="h-5 w-5 text-blue-500" />
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground">
                                    {totalCount > 0 ? Math.round((todoCount / totalCount) * 100) : 0}% of total
                                </div>
                            </div>

                            <div className="rounded-lg border border-border bg-card p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Pending</p>
                                        <p className="text-2xl font-semibold text-foreground">{pendingCount}</p>
                                    </div>
                                    <div className="rounded-full bg-muted p-3">
                                        <Circle className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground">
                                    {totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0}% of total
                                </div>
                            </div>

                            <div className="rounded-lg border border-border bg-card p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Completed</p>
                                        <p className="text-2xl font-semibold text-success">{completedCount}</p>
                                    </div>
                                    <div className="rounded-full bg-success/10 p-3">
                                        <CheckCircle2 className="h-5 w-5 text-success" />
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground">
                                    {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}% of total
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

                                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
                                        <SelectItem value="Done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedItems.size > 0 && (
                            <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                                <span className="text-sm text-muted-foreground">
                                    {selectedItems.size} item{selectedItems.size > 1 ? "s" : ""} selected
                                </span>
                                <Button size="sm" variant="secondary" onClick={bulkMarkDone} className="h-8">
                                    Mark as Done
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setSelectedItems(new Set())} className="h-8">
                                    Clear Selection
                                </Button>
                            </div>
                        )}

                        {/* Table */}
                        <div className="rounded-lg border border-border bg-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/30">
                                            <th className="w-12 px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={filteredItems.length > 0 && selectedItems.size === filteredItems.length}
                                                    onChange={toggleAllItems}
                                                    className="rounded border-border"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Action Item
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Meeting
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Priority
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Due Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Assignee
                                            </th>
                                            <th className="w-12 px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredItems.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-muted/20 transition-colors group"
                                                onClick={() => setSelectedItem(item)}
                                            >
                                                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.has(item.id)}
                                                        onChange={() => toggleItemSelection(item.id)}
                                                        className="rounded border-border"
                                                    />
                                                </td>
                                                <td className="px-4 py-4 cursor-pointer" onClick={() => setSelectedItem(item)}>
                                                    <div className="text-sm font-medium text-foreground max-w-md">{item.title}</div>
                                                </td>
                                                <td className="px-4 py-4 cursor-pointer" onClick={() => setSelectedItem(item)}>
                                                    <div className="text-sm text-muted-foreground font-mono">{item.meeting}</div>
                                                </td>
                                                <td className="px-4 py-4 cursor-pointer" onClick={() => setSelectedItem(item)}>
                                                    <Badge variant="outline" className={`${getPriorityColor(item.priority)} font-medium`}>
                                                        {item.priority}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button className="flex items-center gap-2 hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors">
                                                                {item.status === "Done" ? (
                                                                    <>
                                                                        <CheckCircle2 className="h-4 w-4 text-success" />
                                                                        <span className="text-sm text-success">Done</span>
                                                                    </>
                                                                ) : item.status === "To Do" ? (
                                                                    <>
                                                                        <CircleDashed className="h-4 w-4 text-blue-500" />
                                                                        <span className="text-sm text-blue-500">To Do</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="text-sm text-muted-foreground">Pending</span>
                                                                    </>
                                                                )}
                                                                <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[160px] p-1" align="start">
                                                            <button
                                                                onClick={() => updateStatus(item.id, "To Do")}
                                                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                                                            >
                                                                <CircleDashed className="h-4 w-4 text-blue-500" />
                                                                <span>To Do</span>
                                                                {item.status === "To Do" && <Check className="h-4 w-4 ml-auto" />}
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(item.id, "Pending")}
                                                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                                                            >
                                                                <Circle className="h-4 w-4 text-muted-foreground" />
                                                                <span>Pending</span>
                                                                {item.status === "Pending" && <Check className="h-4 w-4 ml-auto" />}
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(item.id, "Done")}
                                                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                                                            >
                                                                <CheckCircle2 className="h-4 w-4 text-success" />
                                                                <span>Done</span>
                                                                {item.status === "Done" && <Check className="h-4 w-4 ml-auto" />}
                                                            </button>
                                                        </PopoverContent>
                                                    </Popover>
                                                </td>
                                                <td className="px-4 py-4 cursor-pointer" onClick={() => setSelectedItem(item)}>
                                                    <div className="text-sm text-muted-foreground font-mono">
                                                        {new Date(item.dueDate).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button className="flex items-center gap-2 hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors">
                                                                <span className="text-sm text-foreground">{item.assignee}</span>
                                                                <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[240px] p-0" align="start">
                                                            <Command>
                                                                <CommandInput placeholder="Search assignees..." />
                                                                <CommandList>
                                                                    <CommandEmpty>No assignee found.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {availableAssignees.map((assignee) => (
                                                                            <CommandItem
                                                                                key={assignee}
                                                                                onSelect={() => updateAssignee(item.id, assignee)}
                                                                                className="flex items-center justify-between"
                                                                            >
                                                                                <span>{assignee}</span>
                                                                                {item.assignee === assignee && <Check className="h-4 w-4" />}
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                </td>
                                                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>Mark as Done</DropdownMenuItem>
                                                            <DropdownMenuItem>Change Priority</DropdownMenuItem>
                                                            <DropdownMenuItem>Reassign</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredItems.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-muted-foreground">No action items found</p>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                            <div>
                                Showing {filteredItems.length} of {actionItems.length} action items
                            </div>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <ActionItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
                </div>
            </section>
        </div>

    )
}
