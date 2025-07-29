'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { User } from '@/types/user'
import { API } from '@/lib/api'

interface AuthContextProps {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => { },
  loading: true,
  login: async () => { },
  logout: () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Falha no login')
      }

      const data = await res.json()
      Cookies.set('token', data.token, {
        expires: 7,
        path: '/',
        sameSite: 'strict',
      })
      console.log(data);
      setUser(data.user)
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token')
      if (!token) {
        setLoading(false)
        return
      }

      console.log("Token atual:", token)

      try {
        const res = await fetch(`${API}/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        console.log("Resposta /me:", res.status)

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Token inválido')
        }

        const data = await res.json()
        console.log("Dados do usuário:", data)
        setUser(data)
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err)
        Cookies.remove('token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
