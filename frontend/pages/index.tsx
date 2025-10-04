import Head from "next/head"
import { MeetingCard } from "@/components/meetingCard"
import { useMeetings } from "@/hooks/useMeetings"
import { useEffect } from "react"

export default function Home() {
	const { data: meetings, isLoading, error } = useMeetings()

  useEffect(() => {
    console.log("Error:", error)
  }, [error])

	return (
		<>
			<Head>
				<title>fundrAIse</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main>
				<div className="min-h-screen min-w-full flex">
					<section className="flex-1 p-8">
						<div className="min-h-screen bg-background">
							<div className=" mx-auto px-6 py-12">
								<div className="mb-8">
									<h1 className="text-8xl font-semibold text-foreground mb-2 text-balance tracking-tighter">
										Your Meetings
									</h1>
									<p className="pl-4 text-muted-foreground">
										View and manage your meeting summaries and action items
									</p>
								</div>

								{isLoading && (
									<div className="flex justify-center items-center py-12">
										<div className="text-muted-foreground">
											Loading meetings...
										</div>
									</div>
								)}

								{error && (
									<div className="flex justify-center items-center py-12">
										<div className="text-red-500">
											Error loading meetings. Please try again.
										</div>
									</div>
								)}

								{!isLoading && !error && meetings && (
									<div className="flex flex-col gap-4">
										{meetings.length === 0 ? (
											<div className="text-center py-12 text-muted-foreground">
												No meetings found. Create your first meeting to get
												started!
											</div>
										) : (
											meetings.map((meeting) => (
												<MeetingCard key={meeting._id} meeting={meeting} />
											))
										)}
									</div>
								)}
							</div>
						</div>
					</section>
				</div>
			</main>
		</>
	)
}
