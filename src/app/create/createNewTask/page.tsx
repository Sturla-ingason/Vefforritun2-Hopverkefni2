'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type TagType = {
    id: number
    name: string
}

export default function CreateNewTask() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [tag, setTag] = useState('')
    const [tags, setTags] = useState<TagType[]>([])
    const [imageFile, setImageFile] = useState<File | null>(null)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setTags(data) })
    }, [])

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const token = localStorage.getItem('token')

        if (!token) return

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, description, tag }),
        })

        const createdTask = await res.json()

        if (!res.ok) {
            return
        }

        if (imageFile) {
            const formData = new FormData()
            formData.append('image', imageFile)

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${createdTask.id}/image`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })
        }

        router.push('/')
    }

    return (
        <main>
        <div className="grid grid-cols-12">
                <form onSubmit={handleSubmit} className="col-start-1 col-end-13 bg-white rounded-2xl m-8 p-8 text-black flex flex-col gap-4 md:col-start-3 md:col-end-11">
                    <h1 className="text-2xl font-bold">Create New Task</h1>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Name"
                        className="border rounded-xl p-3"
                        required
                    />
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="border rounded-xl p-3"
                    />
                    <div className="flex gap-2 items-center">
                        <select
                            value={tag}
                            onChange={e => setTag(e.target.value)}
                            className="border rounded-xl p-3 flex-1"
                        >
                            <option value="">No tag</option>
                            {tags.map(t => (
                                <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                        </select>
                        <Link href="/create/createTag" className="bg-green rounded-xl px-3 py-3 text-sm whitespace-nowrap">
                            New Tag
                        </Link>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImageFile(e.target.files?.[0] ?? null)}
                        className="border rounded-xl p-3"
                    />

                    <button type="submit" className="bg-green rounded-2xl p-3">
                        Create Task
                    </button>
                </form>
            </div>
        </main>
    )
}