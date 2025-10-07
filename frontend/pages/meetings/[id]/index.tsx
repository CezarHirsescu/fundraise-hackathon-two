import Link from "next/link"
import { useRouter } from "next/router"
import { useMeeting } from "@/hooks/useMeetings"
import { useActionItemsByMeeting } from "@/hooks/useActionItems"
import { MeetingTabs } from "@/components/meetingTabs"
import { MeetingChatbot } from "@/components/meetingChatbot"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Users } from "lucide-react"

export default function MeetingDetailsPage() {
	const router = useRouter()
	const { id } = router.query
	const meetingId = typeof id === "string" ? id : ""

	const {
		data: meeting,
		isLoading: meetingLoading,
		error: meetingError,
	} = useMeeting(meetingId)

	const { data: actionItems, isLoading: actionItemsLoading } = useActionItemsByMeeting(meetingId)

    console.log('Meeting:'  , meeting)
    console.log('actionItems:', actionItems)

	if (meetingLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-muted-foreground">Loading meeting...</div>
			</div>
		)
	}

	if (meetingError || !meeting) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 mb-4">Meeting not found</div>
					<Button asChild>
						<Link href="/">Back to Meetings</Link>
					</Button>
				</div>
			</div>
		)
	}

	const displayName = meeting.title || "Untitled Meeting"
	const formattedDate = new Date(meeting.date).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	})

	// Get first letter of first participant or meeting title for avatar
	const firstParticipant = meeting.participants?.[0] || meeting.title
	const avatarLetter = firstParticipant?.charAt(0).toUpperCase() || "M"

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<header className="border-b border-border bg-card">
				<div className="max-w-[1800px] mx-auto px-6 py-4">
					<div className="flex items-center gap-4 mb-4">
						<Button variant="ghost" size="sm" asChild>
							<Link href="/" className="gap-2">
								<ArrowLeft className="h-4 w-4" />
								Back to Meetings
							</Link>
						</Button>
					</div>

					<div className="flex items-start gap-4">
						<Avatar className="h-16 w-16 border border-border">
							<AvatarFallback className="bg-muted text-muted-foreground text-xl">
								{avatarLetter}
							</AvatarFallback>
						</Avatar>

						<div className="flex-1">
							<h1 className="text-2xl font-bold text-foreground mb-2 text-balance">
								{displayName}
							</h1>

							<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
								<div className="flex items-center gap-1.5">
									<Calendar className="h-4 w-4" />
									<span>{formattedDate}</span>
								</div>

								{meeting.participants && meeting.participants.length > 0 && (
									<div className="flex items-center gap-1.5">
										<Users className="h-4 w-4" />
										<span>{meeting.participants.join(", ")}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="flex-1 flex overflow-hidden">
				<div className="flex-1 bg-background">
					<MeetingTabs
						summary={meeting.summary || ""}
						actionItems={actionItems || []}
						transcript={meeting.transcriptText || ""}
						isLoadingActionItems={actionItemsLoading}
					/>
				</div>

				<div className="w-[400px] lg:w-[480px]">
					<MeetingChatbot />
				</div>
			</div>
		</div>
	)
}
