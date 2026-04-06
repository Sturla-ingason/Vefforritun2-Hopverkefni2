import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex justify-between items-center px-6 py-3 bg-white text-black text-sm border-t">
            <p>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
            <Link href="/auth/logInn" className="hover:underline text-gray-500">
                Admin login
            </Link>
        </footer>
    )
}
