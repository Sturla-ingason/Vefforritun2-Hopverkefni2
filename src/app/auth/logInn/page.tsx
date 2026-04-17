'use client'

import { useState, BaseSyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { NewState } from '@/components/States';

export default function LogInn(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [state, setState] = useState<NewState>('initial')
    const router = useRouter()

    async function handleSubmit(e: BaseSyntheticEvent) {
        e.preventDefault()
        setState('Loading')
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                setState('Error')
                return
            }

            const data = await res.json()
            localStorage.setItem('token', data.token)
            setState('Data')
            router.push('/')
        } catch {
            setState('Error')
        }
    }

    return (
        <div className='grid grid-cols-12 min-h-screen items-center'>
            <form onSubmit={handleSubmit} className='col-start-4 col-end-9 flex flex-col m-8'>
                <input className="
                        bg-white
                        text-black
                        m-2.5
                        p-5
                        rounded-2xl
                        text-center"
                    value={email}
                    onChange={e => setEmail(e.target.value)} type='email'
                    placeholder='email'/>

                <input className="
                        bg-white
                        text-black
                        m-2.5
                        p-5
                        rounded-2xl
                        text-center"
                    value={password}
                    onChange={e => setPassword(e.target.value)} type='password'
                    placeholder='password'/>

                {state === 'Error' && (
                    <p className="text-red-500 text-center m-2.5">User not found. Check your email and password.</p>
                )}

                <button
                    className="
                        text-black
                        text-center
                        bg-green
                        m-2.5
                        p-5
                        rounded-2xl
                        disabled:opacity-50"
                    type="submit"
                    disabled={state === 'Loading'}
                >
                    {state === 'Loading' ? 'Logging in...' : 'Log Inn'}
                </button>
                <Link href="/auth/signUpp" className='text-center'>Dont have a account?</Link>
            </form>
        </div>

    )

}
