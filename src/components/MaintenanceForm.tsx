'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { maintenanceSchema, MaintenanceFormData } from '@/lib/validators/maintenanceSchema'
import { getItems } from '@/services/itemService'
import { Item } from '@/types/item'
import { MaintenanceType } from '@/types/maintenance'
import { useAlert } from '@/context/AlertContext'
import Cookies from 'js-cookie'

type MaintenanceFormProps = {
  itemId: string
  onSuccess?: () => void
}

export function MaintenanceForm({ itemId, onSuccess }: MaintenanceFormProps) {
  const { showAlert } = useAlert()
  const [items, setItems] = useState<Item[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      performedAt: new Date().toISOString().split('T')[0],
      type: MaintenanceType.PREVENTIVA
    }
  })

  useEffect(() => {
    getItems().then(setItems)
    if (itemId) {
      setValue('itemId', itemId)
    }
  }, [itemId, setValue])

  const onSubmitForm = async (data: MaintenanceFormData) => {
    try {
      const token = Cookies.get('token')
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        reset({
          performedAt: new Date().toISOString().split('T')[0],
          type: MaintenanceType.PREVENTIVA
        })
        showAlert('Manutenção registrada com sucesso!', 'success')
        onSuccess?.()
      } else {
        const error = await res.json()
        showAlert(error.error || 'Erro ao registrar manutenção', 'error')
      }
    } catch (error) {
      showAlert('Erro inesperado ao registrar manutenção', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-1">
          Item *
        </label>
        <select
          {...register('itemId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione um item...</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {item.nome} - {item.localizacao}
            </option>
          ))}
        </select>
        {errors.itemId && <p className="text-red-500 text-sm mt-1">{errors.itemId.message}</p>}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Manutenção *
        </label>
        <select
          {...register('type')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={MaintenanceType.PREVENTIVA}>Preventiva</option>
          <option value={MaintenanceType.CORRETIVA}>Corretiva</option>
          <option value={MaintenanceType.EMERGENCIAL}>Emergencial</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
      </div>

      <div>
        <label htmlFor="performedAt" className="block text-sm font-medium text-gray-700 mb-1">
          Data da Manutenção *
        </label>
        <input
          {...register('performedAt')}
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.performedAt && <p className="text-red-500 text-sm mt-1">{errors.performedAt.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição do Serviço *
        </label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Descreva o serviço realizado..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="technician" className="block text-sm font-medium text-gray-700 mb-1">
          Responsável/Técnico *
        </label>
        <input
          {...register('technician')}
          placeholder="Nome do técnico responsável"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.technician && <p className="text-red-500 text-sm mt-1">{errors.technician.message}</p>}
      </div>

      <div>
        <label htmlFor="nextScheduled" className="block text-sm font-medium text-gray-700 mb-1">
          Próxima Manutenção Agendada (opcional)
        </label>
        <input
          {...register('nextScheduled')}
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.nextScheduled && <p className="text-red-500 text-sm mt-1">{errors.nextScheduled.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Registrando...' : 'Registrar Manutenção'}
      </button>
    </form>
  )
}