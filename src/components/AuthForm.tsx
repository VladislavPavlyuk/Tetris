import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './AuthForm.css'

type Mode = 'login' | 'register'

export default function AuthForm({ onClose }: { onClose?: () => void }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, displayName || undefined)
      }
      onClose?.()
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Ошибка'
      setError(msg ?? 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-wrap" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <form className="auth-form" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <h3>{mode === 'login' ? 'Вход' : 'Регистрация'}</h3>
        {error && <p className="auth-form-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Имя (необязательно)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
          />
        )}
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        <button type="submit" disabled={loading}>
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
        <button
          type="button"
          className="auth-form-toggle"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
        >
          {mode === 'login' ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Вход'}
        </button>
        {onClose && (
          <button type="button" className="auth-form-close" onClick={onClose}>
            Закрыть
          </button>
        )}
      </form>
    </div>
  )
}
