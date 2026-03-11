import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { initDb } from './db.js'
import { authRouter } from './routes/auth.js'
import { scoresRouter } from './routes/scores.js'
import { errorHandler } from './middleware/errorHandler.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use('/auth', authRouter)
app.use('/scores', scoresRouter)

const clientDist = path.join(__dirname, '..', 'client-dist')
if (existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}

app.use(errorHandler)

const PORT = Number(process.env.PORT) || 3001

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('DB init failed:', err)
    process.exit(1)
  })
