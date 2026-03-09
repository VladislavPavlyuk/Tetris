import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { User } from '../api/auth'
import * as authApi from '../api/auth'

const STORAGE_KEY = 'tetris_token'
const USER_KEY = 'tetris_user'

interface AuthContextValue {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => void
  isReady: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isReady, setReady] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem(STORAGE_KEY)
    const u = localStorage.getItem(USER_KEY)
    if (t && u) {
      try {
        setToken(t)
        setUser(JSON.parse(u))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setReady(true)
  }, [])

  useEffect(() => {
    const onUnauth = () => {
      setToken(null)
      setUser(null)
    }
    window.addEventListener('tetris_unauthorized', onUnauth)
    return () => window.removeEventListener('tetris_unauthorized', onUnauth)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token: t, user: u } = await authApi.login(email, password)
    localStorage.setItem(STORAGE_KEY, t)
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setToken(t)
    setUser(u)
  }, [])

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    const { token: t, user: u } = await authApi.register(email, password, displayName)
    localStorage.setItem(STORAGE_KEY, t)
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setToken(t)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
