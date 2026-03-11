import axios from 'axios'
import { getApiErrorMessage } from './errors'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tetris_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tetris_token')
      localStorage.removeItem('tetris_user')
      window.dispatchEvent(new Event('tetris_unauthorized'))
    }
    const message = getApiErrorMessage(err)
    const out = err instanceof Error ? err : new Error(message)
    ;(out as Error & { message: string }).message = message
    return Promise.reject(out)
  }
)
