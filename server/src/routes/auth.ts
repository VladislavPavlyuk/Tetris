import { Router } from 'express'
import bcrypt from 'bcrypt'
import { pool } from '../db.js'
import { signToken } from '../middleware/auth.js'
import { toUserMessage } from '../errors.js'

export const authRouter = Router()

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email and password are required.' })
      return
    }
    const hash = await bcrypt.hash(password, 10)
    const conn = await pool.getConnection()
    try {
      const [result] = await conn.query(
        'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
        [email.trim().toLowerCase(), hash, displayName?.trim() || null]
      )
      const insertId = (result as { insertId: number }).insertId
      const emailLower = email.trim().toLowerCase()
      const token = signToken({ userId: insertId, email: emailLower })
      res.status(201).json({ token, user: { id: insertId, email: emailLower, displayName: displayName?.trim() || null } })
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'This email is already registered.' })
        return
      }
      throw e
    } finally {
      conn.release()
    }
  } catch (err) {
    next(err)
  }
})

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email and password are required.' })
      return
    }
    const conn = await pool.getConnection()
    try {
      const [row] = await conn.query(
        'SELECT id, email, password_hash, display_name FROM users WHERE email = ?',
        [email.trim().toLowerCase()]
      )
      const user = Array.isArray(row) ? row[0] : row
      if (!user || !(await bcrypt.compare(password, (user as { password_hash: string }).password_hash))) {
        res.status(401).json({ error: 'Invalid email or password.' })
        return
      }
      const u = user as { id: number; email: string; display_name: string | null }
      const emailLower = u.email.toLowerCase()
      const token = signToken({ userId: u.id, email: emailLower })
      res.json({ token, user: { id: u.id, email: emailLower, displayName: u.display_name } })
    } finally {
      conn.release()
    }
  } catch (err) {
    next(err)
  }
})
