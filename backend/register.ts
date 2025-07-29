import { Role } from "@/types/role";
import { API } from '@/lib/api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export async function register({ name, email, password, role = Role.OPERADOR }: RegisterData) {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erro ao registrar');
  }

  return await res.json();
}