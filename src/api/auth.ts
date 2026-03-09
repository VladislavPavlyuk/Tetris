import { api } from './client'

export interface User {
  id: number
  email: string
  displayName: string | null
}

export async function register(email: string, password: string, displayName?: string) {
  const { data } = await api.post<{ token: string; user: User }>('/auth/register', {
    email,
    password,
    displayName: displayName || undefined,
  })
  return data
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string; user: User }>('/auth/login', { email, password })
  return data
}
