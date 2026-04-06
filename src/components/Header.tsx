'use client'

import Link from "next/link";
import { useRouter } from 'next/navigation'

export default function Header(){

    //TODO þarf að vera linkur á lista notendans
    //TODO þarf að vera linkur aftur a index síðuna
    //TODO vera log out taki þannig að notandi geti loggað sig út af aðgangnum sínum

    const router = useRouter()

    function handleLogout() {
        localStorage.removeItem('token')
        router.push('/auth/logInn')
    }

    return (
        <div className="p-10 col-start-1 col-end-13 text-center">
            <Link href={"/"}><button className="p-2">Home</button></Link>
            <Link href="/lists"><button className="p-2">Lists</button></Link>
            <Link href="/create/createNewTask"><button className="p-2">CreateNewTask</button></Link>
            <Link href="/tags"><button className="p-2">Tags</button></Link>
            <button onClick={handleLogout} className="p-2">Logout</button>
        </div>
    )

}