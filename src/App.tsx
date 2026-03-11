import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import TetrisGame from './components/TetrisGame'
import AuthForm from './components/AuthForm'
import './App.css'

function AppContent() {
  const { user, logout, isReady } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  if (!isReady) return <main className="app">Loading…</main>

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">Tetris</h1>
        <div className="app-user">
          {user ? (
            <>
              <span className="app-username">{user.displayName || user.email}</span>
              <button type="button" className="app-btn" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <button type="button" className="app-btn" onClick={() => setShowAuth(true)}>
              Log in
            </button>
          )}
        </div>
      </header>
      <TetrisGame />
      {showAuth && <AuthForm onClose={() => setShowAuth(false)} />}
    </main>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
