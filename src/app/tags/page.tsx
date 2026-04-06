'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Tag from "@/components/Tag"
import Link from "next/link"
import { NewState } from "@/components/States"

type TagType = {
    id: number
    name: string
}

export default function Tags() {
    const [tags, setTags] = useState<TagType[]>([])
    const [state, setState] = useState<NewState>('Loading')
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/logInn')
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error()
                return res.json()
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setTags(data)
                    setState(data.length === 0 ? 'Empty' : 'Data')
                }
            })
            .catch(() => setState('Error'))
    }, [router])

    function renderTags() {
        if (state === 'Loading') return <p className="col-start-3 col-end-11 text-center p-4">Loading...</p>
        if (state === 'Error') return <p className="col-start-3 col-end-11 text-center p-4 text-red-500">Failed to load tags.</p>
        if (state === 'Empty') return <p className="col-start-3 col-end-11 text-center p-4">No tags yet.</p>
        return tags.map(tag => (
            <Tag
                key={tag.id}
                id={tag.id}
                name={tag.name}
                onDelete={(id) => setTags(prev => prev.filter(t => t.id !== id))}
            />
        ))
    }

    return (
        <main className="grid grid-cols-12">
            <Link href="/create/createTag" className="col-start-3 col-end-11 text-center bg-green text-black rounded-2xl p-2 m-2">
                Create New Tag
            </Link>
            {renderTags()}
        </main>
    )
}
