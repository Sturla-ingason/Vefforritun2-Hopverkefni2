'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

type TaskDetail = {
    id: number
    name: string
    description: string | null
    tags: string | null
    done: boolean
    listId: number | null
    userId: string
    createdAt: string
    updatedAt: string
}

export default function TaskPage() {
    const [task, setTask] = useState<TaskDetail | null>(null)
    const router = useRouter()
    const params = useParams()
    const id = params.id

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/logInn')
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data.id) setTask(data)
            })
    }, [router, id])

    async function handleDone() {
        const token = localStorage.getItem('token')
        const endpoint = task?.done
            ? `${process.env.NEXT_PUBLIC_API_URL}/tasks/not-done/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/tasks/done/${id}`

        await fetch(endpoint, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        })

        setTask(prev => prev ? { ...prev, done: !prev.done } : prev)
    }

    if (!task) return <p>Loading...</p>

    return (
        <main className="grid grid-cols-12 min-h-screen">
            <div className="col-start-3 col-end-10 bg-white rounded-2xl m-8 p-8 text-black flex flex-col gap-4">
                <h1 className={`text-3xl font-bold ${task.done ? 'line-through' : ''}`}>{task.name}</h1>
                <p>{task.description ?? 'No description'}</p>
                <div className="flex gap-2">
                    <span className="font-semibold">Tags:</span>
                    <span>{task.tags ?? 'None'}</span>
                </div>
                <div className="flex gap-2">
                    <span className="font-semibold">Status:</span>
                    <span>{task.done ? 'Done' : 'Not done'}</span>
                </div>
                <div className="flex gap-2">
                    <span className="font-semibold">List:</span>
                    <span>{task.listId ? <a className="underline" href={`/list/${task.listId}`}>View list</a> : 'None'}</span>
                </div>
                <div className="flex gap-2">
                    <span className="font-semibold">Created:</span>
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                    <span className="font-semibold">Updated:</span>
                    <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
                </div>
                <button onClick={handleDone} className="bg-green rounded-2xl p-2 mt-4">
                    {task.done ? 'Undo' : 'Done'}
                </button>
                <button onClick={() => router.back()} className="bg-green rounded-2xl p-2">
                    Back
                </button>
            </div>
        </main>
    )
}
