"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ActionItem } from "@/types/api"

interface MeetingTabsProps {
	actionItems: ActionItem[]
	summary: string
	transcript: string
	isLoadingActionItems?: boolean
}

type Tab = "summary" | "action-items" | "transcript"

export function MeetingTabs({
	actionItems,
	summary,
	transcript,
	isLoadingActionItems,
}: MeetingTabsProps) {
	const [activeTab, setActiveTab] = useState<Tab>("action-items")

	return (
		<div className="flex flex-col h-full">
			<div className="border-b border-border">
				<div className="flex gap-6 px-6">
					<button
						onClick={() => setActiveTab("action-items")}
						className={cn(
							"py-4 text-sm font-medium border-b-2 transition-colors",
							activeTab === "action-items"
								? "border-foreground text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground"
						)}
					>
						Action Items
					</button>
					<button
						onClick={() => setActiveTab("summary")}
						className={cn(
							"py-4 text-sm font-medium border-b-2 transition-colors",
							activeTab === "summary"
								? "border-foreground text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground"
						)}
					>
						Summary
					</button>
					<button
						onClick={() => setActiveTab("transcript")}
						className={cn(
							"py-4 text-sm font-medium border-b-2 transition-colors",
							activeTab === "transcript"
								? "border-foreground text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground"
						)}
					>
						Transcript
					</button>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-6">
				{activeTab === "summary" && (
					<div className="prose prose-invert max-w-none">
						<p className="text-foreground leading-relaxed">{summary}</p>
					</div>
				)}

				{activeTab === "action-items" && (
					<div className="space-y-3">
						{isLoadingActionItems ? (
							<div className="text-center py-8 text-muted-foreground">
								Loading action items...
							</div>
						) : actionItems.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								No action items found for this meeting.
							</div>
						) : (
							actionItems.map((item, index) => (
								<div
									key={item._id}
									className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
								>
									<div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 border border-accent flex items-center justify-center mt-0.5">
										<span className="text-xs text-accent font-medium">
											{index + 1}
										</span>
									</div>
									<div className="flex-1">
										<p className="text-sm text-foreground leading-relaxed">
											{item.text}
										</p>
										<div className="flex gap-2 mt-2">
											<span
												className={cn(
													"text-xs px-2 py-0.5 rounded",
													item.priority === "High" &&
														"bg-red-500/20 text-red-400",
													item.priority === "Medium" &&
														"bg-yellow-500/20 text-yellow-400",
													item.priority === "Low" &&
														"bg-green-500/20 text-green-400"
												)}
											>
												{item.priority}
											</span>
											<span
												className={cn(
													"text-xs px-2 py-0.5 rounded",
													item.status === "To Do" &&
														"bg-blue-500/20 text-blue-400",
													item.status === "Pending" &&
														"bg-yellow-500/20 text-yellow-400",
													item.status === "Completed" &&
														"bg-green-500/20 text-green-400"
												)}
											>
												{item.status}
											</span>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				)}

				{activeTab === "transcript" && (
					<div className="prose prose-invert max-w-none">
						<p className="text-foreground leading-relaxed">{transcript}</p>
					</div>
				)}
			</div>
		</div>
	)
}
