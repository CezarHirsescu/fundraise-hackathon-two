import { useRouter } from "next/router"
import Link from "next/link"

export default function Navbar() {
    const router = useRouter()

    return (
        <nav className='flex flex-col space-y-2' aria-label="Main navigation">
            <Link
                href='/'
                aria-current={router.pathname === '/' ? 'page' : undefined}
                className={`block text-left px-4 py-2 rounded-lg ${router.pathname === '/' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}>
                Meetings
            </Link>
            <Link
                href='/tasks'
                aria-current={router.pathname === '/tasks' ? 'page' : undefined}
                className={`block text-left px-4 py-2 rounded-lg ${router.pathname === '/tasks' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}>
                Tasks
            </Link>
            <Link
                href='/notetaker'
                aria-current={router.pathname === '/notetaker' ? 'page' : undefined}
                className={`block text-left px-4 py-2 rounded-lg ${router.pathname === '/notetaker' ? 'bg-white shadow' : 'hover:bg-gray-100'}`}>
                Notetaker
            </Link>
        </nav>
    )
}