'use client'

import List from "@/components/List"
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
            router.push('/logInn')
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