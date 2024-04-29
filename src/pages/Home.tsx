import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const [username, setUsername] = useState<string | null>(null)
    const [password, setPassword] = useState<string | null>(null)
    const navigate = useNavigate()

    const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleLogin = () => {
        if ((username !== 'admin' || password !== 'password')) {
            alert('Login Failed')
        }
        if (username === 'admin' && password === 'password') {
            localStorage.setItem('token', 'authenticated')
            alert('Login Success')
            navigate('/dashboard')
        }
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='flex justify-center items-center max-w-96 flex-col h-full bg-blue'>
                <input type='text' placeholder='username' className='border border-slate-600 rounded-md px-4 py-2 mb-2' onChange={onChangeUsername} />
                <input type='password' placeholder='password' className='border border-slate-600 rounded-md px-4 py-2 mb-2' onChange={onChangePassword} />
                <button className='bg-blue-700 font-semibold px-4 py-2 text-white rounded-md w-full' onClick={() => handleLogin()}>Login</button>
            </div>
        </div>
    )
}

export default Home