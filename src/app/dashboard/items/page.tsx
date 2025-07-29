'use client'

import { useEffect, useState } from 'react'
import { Item } from '@/types/item'
import { getItems, deleteItem } from '@/services/itemService'
import { useAuth } from '@/context/AuthContext'
import { useAlert } from '@/context/AlertContext'
import { Loader } from '@/components/Loader'
import Alert from '@/components/Alert'
import ItemModal from '@/components/ItemModal'
import UserModal from '@/components/UserModal'

export default function ItemsPage() {
  const { user } = useAuth()
  const { showAlert } = useAlert()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | undefined>()
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const loadItems = async () => {
    try {
      setLoading(true)
      const data = await getItems()
      setItems(data)
      setError('')
    } catch (err) {
      setError('Erro ao carregar itens.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleDelete = async (item: Item) => {
    if (!window.confirm(`Tem certeza que deseja excluir o item "${item.nome}"?`)) {
      return
    }

    try {
      await deleteItem(item.id)
      showAlert('Item excluído com sucesso!', 'success')
      loadItems()
    } catch (error) {
      showAlert(error instanceof Error ? error.message : 'Erro ao excluir item', 'error')
    }
  }

  const handleCreateNew = () => {
    setEditingItem(undefined)
    setModalOpen(true)
  }

  const handleCreateUser = () => {
    setUserModalOpen(true)
  }

  const handleUserSuccess = () => {
    showAlert('Usuário criado com sucesso! Eles já podem fazer login no sistema.', 'success')
  }

  const filteredItems = items.filter(item => {
    const matchesName = item.nome.toLowerCase().includes(filter.toLowerCase()) ||
                       item.descricao.toLowerCase().includes(filter.toLowerCase()) ||
                       item.localizacao.toLowerCase().includes(filter.toLowerCase())
    const matchesStatus = !statusFilter || item.status === statusFilter
    return matchesName && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Operação':
        return 'bg-green-100 text-green-800'
      case 'Em Manutenção':
        return 'bg-yellow-100 text-yellow-800'
      case 'Inativo':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <Loader />
  if (error) return <Alert message={error} type="error" />

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Itens</h1>
        <div className="flex gap-3">
          {user?.role === 'ADMIN' && (
            <button
              onClick={handleCreateUser}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Usuário
            </button>
          )}
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Item
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            type="text"
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Buscar por nome, descrição ou localização..."
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="Em Operação">Em Operação</option>
            <option value="Em Manutenção">Em Manutenção</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Lista de Itens */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {items.length === 0 ? 'Nenhum item cadastrado.' : 'Nenhum item encontrado com os filtros aplicados.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900 truncate">{item.nome}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-2 line-clamp-3">{item.descricao}</p>
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-medium">Local:</span> {item.localizacao}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Editar
                </button>
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Item */}
      <ItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editingItem}
        onSuccess={loadItems}
      />

      {/* Modal de Usuário */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onSuccess={handleUserSuccess}
      />
    </div>
  )
}