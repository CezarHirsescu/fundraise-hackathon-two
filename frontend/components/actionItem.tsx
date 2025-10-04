"use client"

import { X, Calendar, User, Flag, CheckCircle2, MessageSquare, Circle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface ActionItem {
  id: string
  title: string
  meeting: string
  priority: "High" | "Medium" | "Low"
  status: "To Do" | "Pending" | "Done"
  dueDate: string
  assignee: string
  meetingDate: string
  context: string
}

interface ActionItemDetailProps {
  item: ActionItem | null
  onClose: () => void
}

export function ActionItemDetail({ item, onClose }: ActionItemDetailProps) {
  if (!item) return null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20"
      case "Low":
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Done":
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Done
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "To Do":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Circle className="h-3 w-3 mr-1" />
            To Do
          </Badge>
        )
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-foreground mb-2 text-balance">{item.title}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${getPriorityColor(item.priority)} font-medium`}>
                  <Flag className="h-3 w-3 mr-1" />
                  {item.priority} Priority
                </Badge>
                {getStatusBadge(item.status)}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Assignee
                </div>
                <div className="text-sm font-medium text-foreground">{item.assignee}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </div>
                <div className="text-sm font-medium text-foreground font-mono">
                  {new Date(item.dueDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* Meeting Context */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-sm font-medium text-foreground mb-1">From: {item.meeting}</div>
              <div className="text-xs text-muted-foreground font-mono">
                {new Date(item.meetingDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Context */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Meeting Context</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.context}</p>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Notes & Updates
              </h3>
              <Textarea
                placeholder="Add notes or updates about this action item..."
                className="min-h-[120px] bg-background border-border"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button className="flex-1">{item.status === "Done" ? "Reopen" : "Mark as Done"}</Button>
              <Button variant="outline">Change Priority</Button>
              <Button variant="outline">Reassign</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
