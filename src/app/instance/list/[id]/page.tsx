'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Task from '@/components/Task'
import Link from 'next/link'
import { NewState } from '@/components/States'

type TaskType = {
    id: number
    name: string
    description?: string | null
    tags?: string | null
    done: boolean
    listId?: number | null
}

type ListType = {
    id: number
    name: string
}

export default function ListPage() {
    const [tasks, setTasks] = useState<TaskType[]>([])
    const [listName, setListName] = useState('')
    const [state, setState] = useState<NewState>('Loading')
    const router = useRouter()
    const params = useParams()
    const id = Number(params.id)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/logInn')
            return
        }

        Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/my`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/my`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        ])
            .then(async ([tasksRes, listsRes]) => {
                if (!tasksRes.ok || !listsRes.ok) {
                    setState('Error')
                    return
                }
                const [tasksData, listsData] = await Promise.all([
                    tasksRes.json(),
                    listsRes.json(),
                ])
                if (Array.isArray(tasksData)) {
                    setTasks(tasksData.filter((t: TaskType) => t.listId === id))
                }
                if (Array.isArray(listsData)) {
                    const list = listsData.find((l: ListType) => l.id === id)
                    if (list) {
                        setListName(list.name)
                        setState('Data')
                    } else {
                        setState('Error')
                    }
                }
            })
            .catch(() => setState('Error'))
    }, [router, id])

    async function handleDelete() {
        const token = localStorage.getItem('token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/delete/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) router.push('/lists')
    }

    if (state === 'Loading') return <p className="text-center p-8">Loading...</p>
    if (state === 'Error') return <p className="text-center p-8 text-red-500">List not found.</p>

    return (
        <div>
            <main className="grid grid-cols-12">
                <Link href="/lists" className='col-start-3 col-end-4 flex justify-center items-center'><button>Back</button></Link>
                <h1 className="text-2xl p-4 col-start-5 col-end-8 text-center">{listName}</h1>
                {tasks.map(task => (
                    <Task
                        key={task.id}
                        id={task.id}
                        name={task.name}
                        description={task.description}
                        tags={task.tags}
                        done={task.done}
                    />
                ))}
                <button onClick={handleDelete} className='col-start-3 col-end-11 text-center bg-red-500 rounded-2xl m-3 p-2'>Delete</button>
            </main>
        </div>
    )
}
