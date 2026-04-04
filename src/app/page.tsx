'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Task from "@/components/Task"
import Link from 'next/link'


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
      router.push('/logInn')
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


  function handleLogout() {
    localStorage.removeItem('token')
    router.push('/logInn')
  }


  return (
    <div>
      <Link href="/lists"><button>LISTS</button></Link>
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
        <button onClick={handleLogout}>Logout</button>
      </main>
    </div>
  )
}
