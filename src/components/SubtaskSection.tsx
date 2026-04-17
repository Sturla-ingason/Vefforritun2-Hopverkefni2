'use client'

import { useState } from 'react'
import SubTask from '@/components/subTask'

type Subtask = {
    id: number
    name: string
    done: boolean
    taskId: number
}

type Props = {
    taskId: number | string
    initialSubtasks: Subtask[]
}

export default function SubtaskSection({ taskId, initialSubtasks }: Props) {
    const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks)
    const [newSubtask, setNewSubtask] = useState('')

    async function handleAddSubtask() {
        if (!newSubtask.trim()) return
        const token = localStorage.getItem('token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subtasks/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ taskId: Number(taskId), name: newSubtask }),
        })
        const data = await res.json()
        if (data.id) {
            setSubtasks(prev => [...prev, data])
            setNewSubtask('')
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 mt-2 md:flex-row flex-col">
                <input
                    value={newSubtask}
                    onChange={e => setNewSubtask(e.target.value)}
                    placeholder="New subtask"
                    className="border rounded-xl p-2 flex-1"
                />
                <button onClick={handleAddSubtask} className="bg-green rounded-2xl px-3 py-1">Add</button>
            </div>
            <span className="font-semibold">Subtasks:</span>
            {subtasks.length === 0 && <p>No subtasks</p>}
            {subtasks.map(subtask => (
                <SubTask
                    key={subtask.id}
                    id={subtask.id}
                    name={subtask.name}
                    done={subtask.done}
                    onDelete={(id) => setSubtasks(prev => prev.filter(s => s.id !== id))}
                />
            ))}
        </div>
    )
}
