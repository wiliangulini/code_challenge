import { API } from '@/lib/api'
import { Item } from '@/types/item'
import Cookies from 'js-cookie'

const getAuthHeaders = () => {
  const token = Cookies.get('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export async function getItems(): Promise<Item[]> {
  const res = await fetch(`${API}/items`, {
    headers: getAuthHeaders()
  })
  
  if (!res.ok) {
    throw new Error('Erro ao buscar itens')
  }
  
  return res.json()
}

export async function getItemById(id: string): Promise<Item> {
  const res = await fetch(`${API}/items/${id}`, {
    headers: getAuthHeaders()
  })
  
  if (!res.ok) {
    throw new Error('Erro ao buscar item')
  }
  
  return res.json()
}

export async function createItem(item: Omit<Item, 'id'>): Promise<Item> {
  const res = await fetch(`${API}/items`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  })
  
  if (!res.ok) {
    throw new Error('Erro ao criar item')
  }
  
  return res.json()
}

export async function updateItem(id: string, item: Omit<Item, 'id'>): Promise<Item> {
  const res = await fetch(`${API}/items/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  })
  
  if (!res.ok) {
    throw new Error('Erro ao atualizar item')
  }
  
  return res.json()
}

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`${API}/items/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  
  if (!res.ok) {
    throw new Error('Erro ao excluir item')
  }
}