import Navbar from "@/components/navbar"

export default function Meetings() {
    return (
        <div className='min-h-screen min-w-full flex'>
            <aside className='w-36 bg-gray-50 shadow-2xs p-6'>
                <Navbar />
            </aside>
            <section className='flex-1 p-8'>
                <div className="min-h-screen bg-background">
                   <p>Takss</p>
                </div>
            </section>
        </div>
    )
}