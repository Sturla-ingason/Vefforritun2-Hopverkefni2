'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import SubtaskSection from '@/components/SubtaskSection'

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

type Subtask = {
    id: number
    name: string
    done: boolean
    taskId: number
}

type ListType = {
    id: number
    name: string
}

type TagType = {
    id: number
    name: string
}

export default function TaskPage() {
    const [task, setTask] = useState<TaskDetail | null>(null)
    const [subtasks, setSubtasks] = useState<Subtask[]>([])
    const [lists, setLists] = useState<ListType[]>([])
    const [tags, setTags] = useState<TagType[]>([])
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const router = useRouter()
    const params = useParams()
    const id = params.id

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/logInn')
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data.id) setTask(data)
            })

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/subtasks/task/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setSubtasks(data)
            })

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLists(data)
            })

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTags(data)
            })
    }, [router, id])

    async function handleAssignList(listId: number | null) {
        const token = localStorage.getItem('token')
        if (listId === null) {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: task?.name, listId: null }),
            })
            setTask(prev => prev ? { ...prev, listId: null } : prev)
        } else {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/assign-task`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ taskId: Number(id), listId }),
            })
            setTask(prev => prev ? { ...prev, listId } : prev)
        }
    }

    async function handleTagChange(tagName: string) {
        const token = localStorage.getItem('token')
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: task?.name, tag: tagName }),
        })
        setTask(prev => prev ? { ...prev, tags: tagName || null } : prev)
    }

    function handleEditOpen() {
        setEditName(task?.name ?? '')
        setEditDescription(task?.description ?? '')
        setIsEditing(true)
    }

    async function handleEditSave() {
        const token = localStorage.getItem('token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: editName,
                description: editDescription,
                tag: task?.tags ?? '',
                listId: task?.listId ?? null,
            }),
        })
        const data = await res.json()
        if (data.id) {
            setTask(data)
            setIsEditing(false)
        }
    }

    async function handleDelete() {
        const token = localStorage.getItem('token')
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
        router.push('/')
    }

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
            <div className="col-start-1 col-end-13 bg-white rounded-2xl m-8 p-8 text-black flex flex-col gap-4 md:col-start-3 md:col-end-11">
                <div className='justify-between flex md:flex-row flex-col'>
                    {isEditing ? (
                        <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="border rounded-xl p-2 text-3xl font-bold flex-1 mr-4"
                        />
                    ) : (
                        <h1 className={`text-3xl font-bold ${task.done ? 'line-through' : ''}`}>{task.name}</h1>
                    )}
                    <div>
                        {isEditing ? (
                            <>
                                <button onClick={handleEditSave} className="bg-green rounded-2xl p-2 mr-2">Save</button>
                                <button onClick={() => setIsEditing(false)} className="bg-green rounded-2xl p-2 mr-2">Cancel</button>
                            </>
                        ) : (
                            <button onClick={handleEditOpen} className="bg-green rounded-2xl p-2 mr-2">Edit</button>
                        )}
                        <button onClick={() => router.back()} className="bg-green rounded-2xl p-2">
                            Back
                        </button>
                    </div>
                </div>
                {isEditing ? (
                    <textarea
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        className="border rounded-xl p-2"
                        rows={3}
                    />
                ) : (
                    <p>{task.description ?? 'No description'}</p>
                )}
                <div className="flex gap-2 items-center">
                    <span className="font-semibold">Tags:</span>
                    <select
                        value={task.tags ?? ''}
                        onChange={e => handleTagChange(e.target.value)}
                    >
                        <option value="">No tag</option>
                        {tags.map(t => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <span className="font-semibold">Status:</span>
                    <span>{task.done ? 'Done' : 'Not done'}</span>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="font-semibold">List:</span>
                    <select
                        value={task.listId ?? ''}
                        onChange={e => handleAssignList(e.target.value === '' ? null : Number(e.target.value))}
                    >
                        <option value="">No list</option>
                        {lists.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>
                    {task.listId && (
                        <a className="underline text-sm" href={`/instance/list/${task.listId}`}>View list</a>
                    )}
                </div>
                <div className="flex gap-2">
                    <span className="font-semibold">Created:</span>
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 ">
                    <span className="font-semibold">Updated:</span>
                    <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
                </div>

                <SubtaskSection taskId={String(id)} initialSubtasks={subtasks} />
                
                <button onClick={handleDone} className="bg-green rounded-2xl p-2 mt-4">
                    {task.done ? 'Undo' : 'Done'}
                </button>
                <button onClick={handleDelete} className="bg-red-500 text-white rounded-2xl p-2">
                    Delete
                </button>
            </div>
        </main>
    )
}
