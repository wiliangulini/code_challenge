import Cookies from 'js-cookie'

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = Cookies.get('token')

  const headers = {
    ...init.headers,
    Authorization: token ? `Bearer ${token}` : ''
  }

  const response = await fetch(input, { ...init, headers })

  if (response.status === 401 && typeof window !== 'undefined') {
    Cookies.remove('token')
    window.location.href = '/login'
  }

  return response
}
