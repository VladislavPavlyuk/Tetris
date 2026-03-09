import { api } from './client'

export interface LeaderboardEntry {
  displayName: string | null
  email: string
  bestScore: number
}

export async function postScore(score: number) {
  await api.post('/scores', { score })
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data } = await api.get<LeaderboardEntry[]>('/scores/leaderboard')
  return Array.isArray(data) ? data : []
}
