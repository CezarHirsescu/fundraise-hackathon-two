import { useState } from "react"
import Link from "next/link"

export default function Navbar() {
    const [activeTab, setActiveTab] = useState<'meetings' | 'tasks'>('meetings')

    return (
        <nav className='flex flex-col space-y-2' aria-label="Main navigation">
            <button
                onClick={() => setActiveTab('meetings')}
                aria-pressed={activeTab === 'meetings'}
                className={`text-left px-4 py-2 rounded-lg ${activeTab === 'meetings' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}>
                <Link href="/meetings">Meetings</Link>
            </button>
            <button
                onClick={() => setActiveTab('tasks')}
                aria-pressed={activeTab === 'tasks'}
                className={`text-left px-4 py-2 rounded-lg ${activeTab === 'tasks' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}>
                <Link href="/tasks">Tasks</Link>
            </button>
        </nav>
    )

}