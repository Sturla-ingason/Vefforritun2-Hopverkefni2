'use client'

import Header from "@/components/Header"
import List from "@/components/List"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { NewState } from "@/components/States"

type ListType = {
    id: number
    name: string
}

export default function Page(){
    const [lists, setLists] = useState<ListType[]>([])
    const [state, setState] = useState<NewState>('Loading')
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/logInn')
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error()
                return res.json()
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setLists(data)
                    setState(data.length === 0 ? 'Empty' : 'Data')
                }
            })
            .catch(() => setState('Error'))
    }, [router])

    function renderLists() {
        if (state === 'Loading') return <p className="col-start-3 col-end-11 text-center p-4">Loading...</p>
        if (state === 'Error') return <p className="col-start-3 col-end-11 text-center p-4 text-red-500">Failed to load lists.</p>
        if (state === 'Empty') return <p className="col-start-3 col-end-11 text-center p-4">No lists yet.</p>
        return lists.map(list => (
            <List
                key={list.id}
                name={list.name}
                id={list.id}
            />
        ))
    }

    return (
        <main className="grid grid-cols-12">
            <Header/>
            <Link href="/" className='col-start-3 col-end-4 flex justify-center items-center'><button>Back</button></Link>
            <Link href="/create/createList" className="col-start-3 col-end-11 text-center bg-green text-black rounded-2xl p-2 m-3"><button>Create New List</button></Link>
            {renderLists()}
        </main>
    )
}
