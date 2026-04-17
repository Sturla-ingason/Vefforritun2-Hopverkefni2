'use client'

import { useState, BaseSyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'
import { NewState } from '@/components/States'

export default function CreateList() {
    const [name, setName] = useState('')
    const [state, setState] = useState<NewState>('initial')
    const router = useRouter()

    async function handleSubmit(e: BaseSyntheticEvent) {
        e.preventDefault()
        setState('Loading')
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            })

            if (!res.ok) {
                setState('Error')
                return
            }

            router.push('/lists')
        } catch {
            setState('Error')
        }
    }

    return (
        <main>
            <div className="grid grid-cols-12">
            <form onSubmit={handleSubmit} className="col-start-3 col-end-11 bg-white rounded-2xl m-8 p-8 text-black flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Create New List</h1>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                    className="border rounded-xl p-3"
                    required
                />
                {state === 'Error' && (
                    <p className="text-red-500">Failed to create list. Please try again.</p>
                )}
                <button type="submit" disabled={state === 'Loading'} className="bg-green rounded-2xl p-3 disabled:opacity-50">
                    {state === 'Loading' ? 'Creating...' : 'Create List'}
                </button>
            </form>
            </div>
        </main>
    )
}
