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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/createnewuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
        })

        const data = await res.json()
        localStorage.setItem('token', data.token)
        router.push('/')
    }

    return (
        <div className='grid grid-cols-12 min-h-screen items-center'>
            <form onSubmit={handleSignUpp} className='col-start-4 col-end-9 flex flex-col m-8'>
                <input className='
                    bg-white 
                    text-black 
                    m-2.5 
                    p-5 
                    rounded-2xl
                    text-center'
                    value={email} 
                    onChange={e => setEmail(e.target.value)} type='email'
                    placeholder='email'/>
                
                <input className='
                    bg-white 
                    text-black 
                    m-2.5 
                    p-5 
                    rounded-2xl
                    text-center'
                value={password} 
                onChange={e => setPassword(e.target.value)} type='password'
                placeholder='password'/>

                <input className='
                    bg-white 
                    text-black 
                    m-2.5 
                    p-5 
                    rounded-2xl
                    text-center'
                value={name} 
                onChange={e => setName(e.target.value)} type='name'
                placeholder='name'/>

                <button className='
                    text-black 
                    text-center 
                    bg-green 
                    m-2.5 
                    p-5 
                    rounded-2xl'
                type='submit'>Sign upp</button>
            </form>
        </div>

    )
    
}