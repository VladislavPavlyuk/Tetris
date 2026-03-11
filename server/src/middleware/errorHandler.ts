import type { Request, Response, NextFunction } from 'express'
import { toUserMessage } from '../errors.js'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err)
  const message = toUserMessage(err)
  const status = res.headersSent ? 500 : (res.statusCode && res.statusCode >= 400 ? res.statusCode : 500)
  if (!res.headersSent) {
    res.status(status).json({ error: message })
  }
}
