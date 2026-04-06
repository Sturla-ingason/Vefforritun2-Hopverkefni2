'use client'

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/lists', label: 'Lists' },
    { href: '/tags', label: 'Tags' },
    { href: '/create/createNewTask', label: 'New Task' },
]

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()

    function handleLogout() {
        localStorage.removeItem('token')
        router.push('/auth/logInn')
    }

    return (
        <header className="flex justify-between items-center px-6 py-2 bg-white text-black border-b text-sm">
            <nav className="flex gap-1">
                {navLinks.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            pathname === href
                                ? 'bg-green text-black'
                                : 'hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
            <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 font-medium"
            >
                Logout
            </button>
        </header>
    )
}
