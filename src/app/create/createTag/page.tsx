'use client'

import { useState, BaseSyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateTag() {
    const [name, setName] = useState('')
    const router = useRouter()

    async function handleSubmit(e: BaseSyntheticEvent) {
        e.preventDefault()
        const token = localStorage.getItem('token')

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
        })

        if (res.ok) {
            router.push('/tags')
        }
    }

    return (
        <main>
            <div className="grid grid-cols-12">
                <form onSubmit={handleSubmit} className="col-start-3 col-end-11 bg-white rounded-2xl m-8 p-8 text-black flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Create New Tag</h1>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Tag name"
                        className="border rounded-xl p-3"
                        required
                    />
                    <button type="submit" className="bg-green rounded-2xl p-3">
                        Create Tag
                    </button>
                </form>
            </div>
        </main>
    )
}
