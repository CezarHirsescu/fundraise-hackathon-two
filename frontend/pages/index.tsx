import Head from "next/head"
import Navbar from "@/components/navbar"
import { meetings } from "@/lib/meetingsData"
import { MeetingCard } from "@/components/meetingCard"

export default function Home() {
    return (
        <>
            <Head>
                <title>fundrAIse</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <div className='min-h-screen min-w-full flex'>
                    <section className='flex-1 p-8'>
                        <div className="min-h-screen bg-background">
                            <div className=" mx-auto px-6 py-12">
                                <div className="mb-8">
                                    <h1 className="text-8xl font-semibold text-foreground mb-2 text-balance tracking-tighter">Your Meetings</h1>
                                    <p className="pl-4 text-muted-foreground">View and manage your meeting summaries and action items</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {meetings.map((meeting) => (
                                        <MeetingCard key={meeting.id} meeting={meeting} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}