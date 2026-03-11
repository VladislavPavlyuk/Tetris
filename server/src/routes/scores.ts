import { Router } from 'express'
import { pool } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

export const scoresRouter = Router()

scoresRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = (req as unknown as { user: { userId: number } }).user.userId
    const score = Number(req.body?.score)
    if (!Number.isInteger(score) || score < 0) {
      res.status(400).json({ error: 'Invalid score value.' })
      return
    }
    const conn = await pool.getConnection()
    try {
      await conn.query('INSERT INTO scores (user_id, score) VALUES (?, ?)', [userId, score])
      res.status(201).json({ ok: true })
    } finally {
      conn.release()
    }
  } catch (err) {
    next(err)
  }
})

scoresRouter.get('/leaderboard', async (_req, res, next) => {
  try {
    const conn = await pool.getConnection()
    try {
      const rows = await conn.query(`
        SELECT u.display_name AS displayName, u.email, MAX(s.score) AS bestScore
        FROM scores s
        JOIN users u ON s.user_id = u.id
        GROUP BY u.id
        ORDER BY bestScore DESC
        LIMIT 10
      `)
      res.json(Array.isArray(rows) ? rows : [rows])
    } finally {
      conn.release()
    }
  } catch (err) {
    next(err)
  }
})
