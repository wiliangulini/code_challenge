'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Role } from '@/types/role'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    console.log(user);
    if (!user) {
      router.replace('/login')
    } else if (user.role === Role.ADMIN) {
      router.replace('/dashboard/items')
    } else if (user.role === Role.OPERADOR) {
      router.replace('/dashboard/maintenance')
    } else {
      console.log('voltou pro login')
      router.replace('/login')
    }
  }, [user, loading, router])

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500 animate-pulse">Redirecionando...</p>
    </div>
  )
}

