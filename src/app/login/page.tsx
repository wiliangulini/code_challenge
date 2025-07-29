'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/services/authService'
import { useAlert } from '@/context/AlertContext'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { showAlert } = useAlert()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {

      const { user, token } = await login(email, password)

      console.log(user, token)

      Cookies.set('token', token, {
        expires: 7,
        path: '/',
        sameSite: 'strict',
      })

      router.push('/dashboard/items')


    } catch (err) {
      showAlert('Credenciais inválidas', 'error')
    }
  }

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2 p-2 border w-full" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="mb-4 p-2 border w-full" />
      <button className="bg-blue-500 text-white py-2 px-4 rounded">Entrar</button>
    </form>
  )
}
