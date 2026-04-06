'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Task from "@/components/Task"
import Header from '@/components/Header'


type TaskType = {
  id: number
  name: string
  description?: string | null
  tags?: string | null
  done: boolean
}

export default function Home() {
  const [tasks, setTasks] = useState<TaskType[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/logInn')
      return
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => Array.isArray(data) && setTasks(data))
  }, [router])



  return (
    <div>
      <main className="grid grid-cols-12">
        <Header/>
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
