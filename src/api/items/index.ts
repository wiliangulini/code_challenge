// GET, POST

import { NextApiRequest, NextApiResponse } from 'next'
import { items } from '@/lib/data'
import { itemSchema } from '@/lib/validators/itemSchema'
import { v4 as uuidv4 } from 'uuid'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { status } = req.query
    if (status) {
      const filtered = items.filter(i => i.status === status)
      return res.status(200).json(filtered)
    }
    return res.status(200).json(items)
  }

  if (req.method === 'POST') {
    try {
      const parsed = itemSchema.parse(req.body)
      const newItem = { id: uuidv4(), ...parsed }
      items.push(newItem)
      return res.status(201).json(newItem)
    } catch (err: any) {
      return res.status(400).json({ error: err.errors })
    }
  }

  return res.status(405).end()
}