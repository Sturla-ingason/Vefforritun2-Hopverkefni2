'use client'

import Header from "@/components/Header"
import List from "@/components/List"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type ListType = {
    id: number
    name: string
}

export default function Page(){
    const [lists, setLists] = useState<ListType[]>([]);
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/logInn')
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/my`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(res => res.json())
        .then(data => Array.isArray(data) && setLists(data))
    }, [router])


    return (
        <main className="grid grid-cols-12">
            <Header/>
            <Link href="/" className='col-start-3 col-end-4 flex justify-center items-center'><button>Back</button></Link>
            <Link href="/create/createList" className="col-start-3 col-end-10 text-center bg-green text-black rounded-2xl p-2 m-3"><button>Create New List</button></Link>
            {lists.map(list => (
                <List
                    key={list.id}
                    name={list.name}
                    id={list.id}
                />
            ))}
        </main>
    )
}