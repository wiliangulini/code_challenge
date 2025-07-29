'use client'

import { useEffect, useState } from 'react'
import { Maintenance } from '@/types/maintenance'
import { Item } from '@/types/item'
import { MaintenanceForm } from '@/components/MaintenanceForm'
import { getItems } from '@/services/itemService'
import { Loader } from '@/components/Loader'
import { useAlert } from '@/context/AlertContext'
import Cookies from 'js-cookie'

export default function MaintenancePage() {
  const { showAlert } = useAlert()
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [itemHistory, setItemHistory] = useState<Maintenance[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const loadMaintenances = async () => {
    try {
      const token = Cookies.get('token')
      const res = await fetch('/api/maintenance', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setMaintenances(data)
      }
    } catch (error) {
      showAlert('Erro ao carregar manutenções', 'error')
    }
  }

  const loadItems = async () => {
    try {
      const data = await getItems()
      setItems(data)
    } catch (error) {
      showAlert('Erro ao carregar itens', 'error')
    }
  }

  const loadItemHistory = async (itemId: string) => {
    if (!itemId) return
    
    setLoadingHistory(true)
    try {
      const token = Cookies.get('token')
      const res = await fetch(`/api/maintenance/history/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setItemHistory(data)
      }
    } catch (error) {
      showAlert('Erro ao carregar histórico', 'error')
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([loadMaintenances(), loadItems()])
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (selectedItem) {
      loadItemHistory(selectedItem)
    } else {
      setItemHistory([])
    }
  }, [selectedItem])

  const handleSuccess = () => {
    loadMaintenances()
    if (selectedItem) {
      loadItemHistory(selectedItem)
    }
    setShowForm(false)
  }

  const getMaintenanceTypeColor = (type: string) => {
    switch (type) {
      case 'Preventiva':
        return 'bg-blue-100 text-blue-800'
      case 'Corretiva':
        return 'bg-orange-100 text-orange-800'
      case 'Emergencial':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Controle de Manutenção</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Nova Manutenção'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Registrar Nova Manutenção</h2>
          <MaintenanceForm onSuccess={handleSuccess} itemId={''} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histórico por Item */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Histórico por Item</h2>
          
          <div className="mb-4">
            <label htmlFor="itemSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Selecione um item:
            </label>
            <select
              id="itemSelect"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um item...</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
            </select>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : itemHistory.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {itemHistory.map((maintenance) => (
                <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMaintenanceTypeColor(maintenance.type)}`}>
                      {maintenance.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(maintenance.performedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{maintenance.description}</p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Técnico:</span> {maintenance.technician}
                  </p>
                  {maintenance.nextScheduled && (
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Próxima:</span> {new Date(maintenance.nextScheduled).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : selectedItem ? (
            <p className="text-gray-500 text-center py-8">Nenhuma manutenção registrada para este item.</p>
          ) : (
            <p className="text-gray-500 text-center py-8">Selecione um item para ver o histórico.</p>
          )}
        </div>

        {/* Manutenções Recentes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manutenções Recentes</h2>
          
          {maintenances.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {maintenances
                .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
                .slice(0, 10)
                .map((maintenance) => {
                  const item = items.find(i => i.id === maintenance.itemId)
                  return (
                    <div key={maintenance.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{item?.nome || 'Item não encontrado'}</h3>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getMaintenanceTypeColor(maintenance.type)} mt-1`}>
                            {maintenance.type}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(maintenance.performedAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{maintenance.description}</p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Técnico:</span> {maintenance.technician}
                      </p>
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhuma manutenção registrada.</p>
          )}
        </div>
      </div>
    </div>
  )
}