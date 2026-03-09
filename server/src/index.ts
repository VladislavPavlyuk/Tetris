import express from 'express'
import cors from 'cors'
import { initDb } from './db.js'
import { authRouter } from './routes/auth.js'
import { scoresRouter } from './routes/scores.js'

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use('/auth', authRouter)
app.use('/scores', scoresRouter)

const PORT = Number(process.env.PORT) || 3001

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('DB init failed:', err)
    process.exit(1)
  })
