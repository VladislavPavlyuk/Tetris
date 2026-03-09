import { useEffect, useRef } from 'react'
import { useTetris } from '../hooks/useTetris'
import { useAuth } from '../contexts/AuthContext'
import { postScore } from '../api/scores'
import { ROWS, COLS } from '../types/tetris'
import { TETROMINOES, ID_TO_COLOR } from '../constants/tetris'
import Leaderboard from './Leaderboard'
import './TetrisGame.css'

const CELL_PX = 24

export default function TetrisGame() {
  const { grid, activePiece, nextPiece, score, gameOver, reset } = useTetris()
  const { user } = useAuth()
  const scoreSentRef = useRef(false)

  useEffect(() => {
    if (gameOver && user && !scoreSentRef.current) {
      scoreSentRef.current = true
      postScore(score).catch(() => {})
    }
  }, [gameOver, user, score])

  useEffect(() => {
    if (!gameOver) scoreSentRef.current = false
  }, [gameOver])

  return (
    <div className="tetris-game">
      <aside className="tetris-side">
        <div className="tetris-next">
          <span>Next</span>
          <NextPiecePreview piece={nextPiece} />
        </div>
        <div className="tetris-stats">Score: {score}</div>
      </aside>
      <div className="tetris-playfield-wrap">
        <div
          className="tetris-playfield"
          style={{
            width: COLS * CELL_PX,
            height: ROWS * CELL_PX,
            gridTemplateColumns: `repeat(${COLS}, ${CELL_PX}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${CELL_PX}px)`,
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className="tetris-cell"
                style={{
                  gridColumn: x + 1,
                  gridRow: y + 1,
                  backgroundColor: cell ? ID_TO_COLOR[cell] : undefined,
                }}
              />
            ))
          )}
          {activePiece.shape.map((row, dy) =>
            row.map((cell, dx) => {
              if (cell === 0) return null
              const gy = activePiece.pos.y + dy
              if (gy < 0) return null
              return (
                <div
                  key={`p-${dy}-${dx}`}
                  className="tetris-cell tetris-cell-piece"
                  style={{
                    gridColumn: activePiece.pos.x + dx + 1,
                    gridRow: gy + 1,
                    backgroundColor: TETROMINOES[activePiece.type].color,
                  }}
                />
              )
            })
          )}
        </div>
        {gameOver && (
          <div className="tetris-gameover">
            <p>Game Over</p>
            <p>Счёт: {score}</p>
            <Leaderboard />
            <button type="button" onClick={reset}>
              Играть снова
            </button>
          </div>
        )}
      </div>
      <div className="tetris-controls-hint">
        ← → move · ↑ or X rotate CW · Z rotate CCW · ↓ soft drop · Space hard drop
      </div>
    </div>
  )
}

function NextPiecePreview({ piece }: { piece: { type: keyof typeof TETROMINOES; shape: number[][] } }) {
  const color = TETROMINOES[piece.type].color
  const rows = piece.shape.length
  const cols = piece.shape[0].length
  const size = 16
  return (
    <div
      className="tetris-next-grid"
      style={{
        width: cols * size,
        height: rows * size,
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gridTemplateRows: `repeat(${rows}, ${size}px)`,
      }}
    >
      {piece.shape.map((row, y) =>
        row.map(
          (cell, x) =>
            cell !== 0 && (
              <div
                key={`${y}-${x}`}
                style={{
                  gridColumn: x + 1,
                  gridRow: y + 1,
                  backgroundColor: color,
                }}
              />
            )
        )
      )}
    </div>
  )
}
