// PUT, DELETE

import { NextApiRequest, NextApiResponse } from 'next'
import { items } from '@/lib/data'
import { itemSchema } from '@/lib/validators/itemSchema'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const index = items.findIndex(i => i.id === id)

  if (index === -1) return res.status(404).json({ error: 'Item not found' })

  if (req.method === 'PUT') {
    try {
      const parsed = itemSchema.parse(req.body)
      items[index] = { ...items[index], ...parsed }
      return res.status(200).json(items[index])
    } catch (err: any) {
      return res.status(400).json({ error: err.errors })
    }
  }

  if (req.method === 'DELETE') {
    items.splice(index, 1)
    return res.status(204).end()
  }

  return res.status(405).end()
}