'use client'

import { useState } from 'react'

type SubtaskProps = {
    id: number
    name: string
    done: boolean
    onDelete: (id: number) => void
}

export default function SubTask({ id, name, done, onDelete }: SubtaskProps) {
    const [isDone, setIsDone] = useState(done)

    async function handleToggle() {
        const token = localStorage.getItem('token')
        const endpoint = isDone
            ? `${process.env.NEXT_PUBLIC_API_URL}/subtasks/notdone/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/subtasks/done/${id}`

        await fetch(endpoint, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        })

        setIsDone(!isDone)
    }

    async function handleDelete(){
        const token = localStorage.getItem('token')

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subtasks/delete/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) onDelete(id)
    }

    return (
        <div className="flex justify-between items-center w-full">
            <span className={isDone ? 'line-through' : ''}>{name}</span>
            <div>
                {isDone && (
                    <button onClick={handleDelete} className="bg-red-500 rounded-2xl p-1 mr-2 px-2 text-sm">Delete</button>
                )}
                <button onClick={handleToggle} className="bg-green rounded-2xl p-1 px-2 text-sm">
                    {isDone ? 'Undo' : 'Done'}
                </button>
            </div>
        </div>
    )
}
