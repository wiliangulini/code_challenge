'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'


export const Navbar = () => {
  const { user, logout } = useAuth()
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <span>Bem-vindo, {user?.name || 'Visitante'}</span>
      <div className="space-x-4">
        {user?.role === 'ADMIN' && <Link href="/dashboard/users">Usuários</Link>}
        {user && <button onClick={logout}>Sair</button>}
      </div>
    </nav>
  )
}