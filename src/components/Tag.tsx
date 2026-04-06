'use client'

type TagProps = {
    name: string
    id: number
    onDelete: (id: number) => void
}

export default function Tag({ name, id, onDelete }: TagProps) {
    async function handleDelete() {
        const token = localStorage.getItem('token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/delete/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) onDelete(id)
    }

    return (
        <div className="flex justify-between items-center bg-white rounded-2xl m-2 p-4 col-start-3 col-end-11 text-black">
            <p className="font-semibold">{name}</p>
            <button onClick={handleDelete} className="bg-red-500 text-white rounded-2xl px-3 py-1 text-sm">Delete</button>
        </div>
    )
}
