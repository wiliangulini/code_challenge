import { API } from '@/lib/api';

export async function getItems() {
  const res = await fetch(`${API}/items`)
  return res.json()
}

export async function createItem(item: { name: string; description: string }) {
  const res = await fetch(`${API}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  return res.json()
}