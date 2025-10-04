import { meetings } from "@/lib/meetingsData"
import { MeetingCard } from "@/components/meetingCard"

export default function MeetingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Meeting Notes</h1>
          <p className="text-muted-foreground">View and manage your meeting summaries and action items</p>
        </div>

        <div className="flex flex-col gap-4">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </div>
    </div>
  )
}
