'use client'

import { useState, BaseSyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LogInn(){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()

    async function handleSubmit(e: BaseSyntheticEvent) {
        e.preventDefault()
        const res = await fetch('http://localhost:3002/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        })

        const data = await res.json()
        localStorage.setItem('token', data.token)
        console.log(localStorage.getItem('token'))
        router.push('/')
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={email} onChange={e => setEmail(e.target.value)} type='email'/>
            <input value={password} onChange={e => setPassword(e.target.value)} type='password'/>
            <button type="submit">Log Inn</button>
        </form>
    )

}