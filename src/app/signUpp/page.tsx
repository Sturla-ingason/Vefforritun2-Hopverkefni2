'use client'

import { useState, BaseSyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpp(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('')
    const router = useRouter()

    async function handleSignUpp(e: BaseSyntheticEvent){
        e.preventDefault()
        const res = await fetch('http://localhost:3002/user/createnewuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
        })

        const data = await res.json()
        localStorage.setItem('token', data.token)
        router.push('/')
    }

    return (
        <form onSubmit={handleSignUpp}>
            <input value={email} onChange={e => setEmail(e.target.value)} type='email'/>
            <input value={password} onChange={e => setPassword(e.target.value)} type='password'/>
            <input value={name} onChange={e => setName(e.target.value)} type='name'/>
            <button type='submit'>Sign upp</button>
        </form>
    )
    
}