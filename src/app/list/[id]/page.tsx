'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Task from '@/components/Task'

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
    const router = useRouter()
    const params = useParams()
    const id = Number(params.id)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/logInn')
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTasks(data.filter((t: TaskType) => t.listId === id))
                }
            })

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const list = data.find((l: ListType) => l.id === id)
                    if (list) setListName(list.name)
                }
            })
    }, [router, id])

    return (
        <div>
            <h1 className="text-2xl p-4">{listName}</h1>
            <main className="grid grid-cols-12">
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
            </main>
        </div>
    )
}
