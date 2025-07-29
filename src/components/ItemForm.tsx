'use client'

import { useState } from 'react'
import { Item, ItemStatus } from '@/types/item'
import { createItem, updateItem } from '@/services/itemService'
import { useAlert } from '@/context/AlertContext'

interface ItemFormProps {
  item?: Item
  onSuccess: () => void
  onCancel: () => void
}

export default function ItemForm({ item, onSuccess, onCancel }: ItemFormProps) {
  const { showAlert } = useAlert()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: item?.nome || '',
    descricao: item?.descricao || '',
    localizacao: item?.localizacao || '',
    status: item?.status || ItemStatus.OPERACAO
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.descricao || !formData.localizacao) {
      showAlert('Todos os campos são obrigatórios', 'error')
      return
    }

    setLoading(true)
    
    try {
      if (item) {
        await updateItem(item.id, formData)
        showAlert('Item atualizado com sucesso!', 'success')
      } else {
        await createItem(formData)
        showAlert('Item criado com sucesso!', 'success')
      }
      onSuccess()
    } catch (error) {
      showAlert(error instanceof Error ? error.message : 'Erro inesperado', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Item *
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o nome do item"
          required
        />
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite a descrição do item"
          required
        />
      </div>

      <div>
        <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700 mb-1">
          Localização *
        </label>
        <input
          type="text"
          id="localizacao"
          name="localizacao"
          value={formData.localizacao}
          onChange={handleChange}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite a localização do item"
          required
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value={ItemStatus.OPERACAO}>Em Operação</option>
          <option value={ItemStatus.MANUTENCAO}>Em Manutenção</option>
          <option value={ItemStatus.INATIVO}>Inativo</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : (item ? 'Atualizar' : 'Criar')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
