import { useState, useCallback, useEffect } from 'react'
import type { ActivePiece, TetrominoKey } from '../types/tetris'
import { TETROMINOES } from '../constants/tetris'
import {
  createEmptyGrid,
  isCollision,
  mergePieceIntoGrid,
  sweepLines,
  rotateMatrixCW,
  rotateMatrixCCW,
} from '../utils/tetris'

const KEYS: TetrominoKey[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']

function getRandomPiece(): ActivePiece {
  const key = KEYS[Math.floor(Math.random() * KEYS.length)]
  const def = TETROMINOES[key]
  return {
    type: key,
    shape: def.shape.map(row => [...row]),
    pos: { x: Math.floor((10 - def.shape[0].length) / 2), y: 0 },
  }
}

const DROP_MS = 800

export function useTetris() {
  const [grid, setGrid] = useState(createEmptyGrid)
  const [activePiece, setActivePiece] = useState<ActivePiece>(getRandomPiece)
  const [nextPiece, setNextPiece] = useState<ActivePiece>(getRandomPiece)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  /** Фиксирует переданную фигуру в сетке (или текущую activePiece, если piece не передан). */
  const lockPieceAt = useCallback(
    (pieceToLock?: ActivePiece) => {
      const piece = pieceToLock ?? activePiece
      const merged = mergePieceIntoGrid(grid, piece)
      const { grid: newGrid, scoreIncrement } = sweepLines(merged)
      setGrid(newGrid)
      setScore(s => s + scoreIncrement)
      const next = nextPiece
      setNextPiece(getRandomPiece())
      setActivePiece(next)
      if (isCollision(next, newGrid, 0, 0)) {
        setGameOver(true)
      }
    },
    [activePiece, grid, nextPiece]
  )

  const lockPiece = useCallback(() => lockPieceAt(), [lockPieceAt])

  const movePieceDown = useCallback(() => {
    if (gameOver) return
    // Достигла дна или другой фигуры — фиксируем, дальше не двигаем
    if (isCollision(activePiece, grid, 0, 1)) {
      lockPieceAt()
    } else {
      setActivePiece(prev => ({
        ...prev,
        pos: { ...prev.pos, y: prev.pos.y + 1 },
      }))
    }
  }, [activePiece, grid, gameOver, lockPieceAt])

  // Game loop: useEffect as game heartbeat
  useEffect(() => {
    if (gameOver) return
    const dropInterval = setInterval(movePieceDown, DROP_MS)
    return () => clearInterval(dropInterval)
  }, [activePiece, grid, gameOver, movePieceDown])

  const move = useCallback(
    (dx: number, dy: number) => {
      if (gameOver) return
      if (!isCollision(activePiece, grid, dx, dy)) {
        setActivePiece(prev => ({
          ...prev,
          pos: { x: prev.pos.x + dx, y: prev.pos.y + dy },
        }))
      }
    },
    [activePiece, grid, gameOver]
  )

  const rotate = useCallback(
    (cw: boolean) => {
      if (gameOver) return
      const rotated = cw
        ? rotateMatrixCW(activePiece.shape)
        : rotateMatrixCCW(activePiece.shape)
      const next: ActivePiece = { ...activePiece, shape: rotated }
      // Simple wall kick: try 0, -1, 1 in x
      for (const kx of [0, -1, 1]) {
        if (!isCollision({ ...next, pos: { ...next.pos, x: activePiece.pos.x + kx } }, grid, 0, 0)) {
          setActivePiece({ ...next, pos: { ...next.pos, x: activePiece.pos.x + kx } })
          return
        }
      }
    },
    [activePiece, grid, gameOver]
  )

  const hardDrop = useCallback(() => {
    if (gameOver) return
    let dy = 0
    while (!isCollision(activePiece, grid, 0, dy + 1)) dy++
    const droppedPiece: ActivePiece = {
      ...activePiece,
      pos: { ...activePiece.pos, y: activePiece.pos.y + dy },
    }
    lockPieceAt(droppedPiece)
  }, [activePiece, grid, gameOver, lockPieceAt])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) return
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          move(-1, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          move(1, 0)
          break
        case 'ArrowDown':
          e.preventDefault()
          movePieceDown()
          break
        case 'ArrowUp':
        case 'x':
        case 'X':
          e.preventDefault()
          rotate(true)
          break
        case 'z':
        case 'Z':
          e.preventDefault()
          rotate(false)
          break
        case ' ':
          e.preventDefault()
          hardDrop()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gameOver, move, movePieceDown, rotate, hardDrop])

  const reset = useCallback(() => {
    setGrid(createEmptyGrid())
    setNextPiece(getRandomPiece())
    setActivePiece(getRandomPiece())
    setScore(0)
    setGameOver(false)
  }, [])

  return {
    grid,
    activePiece,
    nextPiece,
    score,
    gameOver,
    reset,
  }
}
