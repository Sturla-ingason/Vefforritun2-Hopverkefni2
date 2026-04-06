'use client'

import { useState } from 'react'
import Link from 'next/link'

type TaskProps = {
    id: number
    name: string
    description?: string | null
    tags?: string | null
    done: boolean
}

export default function Task({ id, name, description, tags, done }: TaskProps){
    const [isDone, setIsDone] = useState(done)

    async function handleDone() {
        const token = localStorage.getItem('token')
        const endpoint = isDone
            ? `${process.env.NEXT_PUBLIC_API_URL}/tasks/not-done/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/tasks/done/${id}`

        await fetch(endpoint, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        })

        setIsDone(!isDone)
    }

    return (
        <div className="flex justify-between items-center bg-white m-3 rounded-2xl col-start-3 col-end-10">
            <div className="flex flex-col flex-2 p-1 text-black">
                <h2 className={`font-bold &{isDone ? 'line-through' : ''}`}>{name}</h2>
                <p>{description}</p>
            </div>
            <div className="flex flex-col flex-1 p-1 text-black text-center">
                <p>{tags}</p>
            </div>
            <div className="flex flex-col flex-1 p-3 text-black">
                <button onClick={handleDone} className="bg-green p-1 m-1 rounded-2xl">
                    {isDone ? 'Undo' : 'Done'}
                </button>
                <Link href={`/instance/task/${id}`} className="bg-green p-1 m-1 rounded-2xl text-center"><button>Details</button></Link>
            </div>
        </div>
    )
}
