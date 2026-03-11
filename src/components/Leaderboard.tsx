import { useState, useEffect } from 'react'
import { getLeaderboard } from '../api/scores'
import type { LeaderboardEntry } from '../api/scores'
import { getApiErrorMessage } from '../api/errors'
import './Leaderboard.css'

export default function Leaderboard() {
  const [list, setList] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getLeaderboard()
      .then(setList)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="leaderboard-loading">Loading leaderboard…</div>
  if (error) return <div className="leaderboard-error">{error}</div>
  if (list.length === 0) return <div className="leaderboard-empty">No results yet</div>

  return (
    <div className="leaderboard">
      <h4>Leaderboard (best scores)</h4>
      <ol className="leaderboard-list">
        {list.map((entry, i) => (
          <li key={`${entry.email}-${i}`}>
            <span className="leaderboard-rank">{i + 1}</span>
            <span className="leaderboard-name">{entry.displayName || entry.email}</span>
            <span className="leaderboard-score">{entry.bestScore}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
