'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useAlert } from '@/context/AlertContext'
import { Loader } from '@/components/Loader'
import Cookies from 'js-cookie'

interface User {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'OPERADOR'
}

export default function UsersPage() {
  const { user } = useAuth()
  const { showAlert } = useAlert()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    try {
      const token = Cookies.get('token')
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      } else {
        showAlert('Erro ao carregar usuários', 'error')
      }
    } catch (error) {
      showAlert('Erro ao carregar usuários', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: number, newRole: 'ADMIN' | 'OPERADOR') => {
    try {
      const token = Cookies.get('token')
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })

      if (res.ok) {
        showAlert('Role atualizado com sucesso!', 'success')
        loadUsers()
      } else {
        showAlert('Erro ao atualizar role', 'error')
      }
    } catch (error) {
      showAlert('Erro ao atualizar role', 'error')
    }
  }

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
      return
    }

    try {
      const token = Cookies.get('token')
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        showAlert('Usuário excluído com sucesso!', 'success')
        loadUsers()
      } else {
        showAlert('Erro ao excluir usuário', 'error')
      }
    } catch (error) {
      showAlert('Erro ao excluir usuário', 'error')
    }
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadUsers()
    } else {
      setLoading(false)
    }
  }, [user])

  if (loading) return <Loader />

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Apenas administradores podem acessar esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
        <div className="text-sm text-gray-500">
          Total: {users.length} usuário{users.length !== 1 ? 's' : ''}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-900">
                              {userItem.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{userItem.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={userItem.role}
                        onChange={(e) => handleRoleChange(userItem.id, e.target.value as 'ADMIN' | 'OPERADOR')}
                        disabled={userItem.id === user?.id}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="OPERADOR">OPERADOR</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {userItem.id !== user?.id && (
                        <button
                          onClick={() => handleDeleteUser(userItem.id, userItem.name)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Excluir
                        </button>
                      )}
                      {userItem.id === user?.id && (
                        <span className="text-gray-400 text-xs">Você</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
