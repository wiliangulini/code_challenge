import Cookies from "js-cookie";
import { API } from '@/lib/api';
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function login(email: string, password: string) {

  console.log('Tentando login com:', { email, password });

  const res = await fetchWithAuth(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao fazer login')
  }

  const data = await res.json()
  console.log(data);
  Cookies.set('token', data.token, {
    expires: 7,
    path: '/',
    sameSite: 'strict',
  })

  return {
    user: data.user,
    token: data.token,
  }
}

export async function getCurrentUser() {
  const token = Cookies.get('token')

  const res = await fetchWithAuth(`${API}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error('Não autenticado')

  return res.json()
}
