"use client"
import Alert from '@/components/Alert'
import { Loader} from '@/components/Loader'
import { getItems } from '@/services/itemService'
import { useEffect, useState } from 'react'

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getItems()
      .then(data => setItems(data))
      .catch(() => setError('Erro ao carregar itens.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (error) return <Alert message={error} />

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Itens</h1>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <li key={item.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{item.nome}</h2>
            <p>{item.descricao}</p>
            <span className="text-sm text-gray-500">{item.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}