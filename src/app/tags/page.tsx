'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Tag from "@/components/Tag"
import Link from "next/link"

type TagType = {
    id: number
    name: string
}

export default function Tags() {
    const [tags, setTags] = useState<TagType[]>([])
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
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTags(data)
            })
    }, [router])

    return (
        <main className="grid grid-cols-12">
            <Header />
            <Link href="/create/createTag" className="col-start-3 col-end-10 text-center bg-green text-black rounded-2xl p-2 m-2">
                Create New Tag
            </Link>
            {tags.map(tag => (
                <Tag
                    key={tag.id}
                    id={tag.id}
                    name={tag.name}
                    onDelete={(id) => setTags(prev => prev.filter(t => t.id !== id))}
                />
            ))}
        </main>
    )
}
