'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Task from "@/components/Task"
import Header from '@/components/Header'
import { NewState } from '@/components/States'

type TaskType = {
  id: number
  name: string
  description?: string | null
  tags?: string | null
  done: boolean
}

export default function Home() {
  const [tasks, setTasks] = useState<TaskType[]>([])
  const [state, setState] = useState<NewState>('Loading')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/logInn')
      return
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data)
          setState(data.length === 0 ? 'Empty' : 'Data')
        }
      })
      .catch(() => setState('Error'))
  }, [router])

  function renderTasks() {
    if (state === 'Loading') return <p className="col-start-3 col-end-11 text-center p-4">Loading...</p>
    if (state === 'Error') return <p className="col-start-3 col-end-11 text-center p-4 text-red-500">Failed to load tasks.</p>
    if (state === 'Empty') return <p className="col-start-3 col-end-11 text-center p-4">No tasks yet.</p>
    return tasks.map(task => (
      <Task
        key={task.id}
        id={task.id}
        name={task.name}
        description={task.description}
        tags={task.tags}
        done={task.done}
      />
    ))
  }

  return (
    <div>
      <main className="grid grid-cols-12">
        <Header/>
        {renderTasks()}
      </main>
    </div>
  )
}
