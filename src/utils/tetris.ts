import { COLS, ROWS } from '../types/tetris'
import type { Grid, ActivePiece } from '../types/tetris'
import { TETROMINOES, LINE_POINTS } from '../constants/tetris'

/** Create empty 10×20 grid (stateful 2D array). */
export function createEmptyGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Grid[0])
}

/** Rotate 2D matrix 90° clockwise. */
export function rotateMatrixCW<T>(m: T[][]): T[][] {
  const rows = m.length
  const cols = m[0].length
  return Array.from({ length: cols }, (_, i) =>
    Array.from({ length: rows }, (_, j) => m[rows - 1 - j][i])
  )
}

/** Rotate 2D matrix 90° counter-clockwise. */
export function rotateMatrixCCW<T>(m: T[][]): T[][] {
  const rows = m.length
  const cols = m[0].length
  return Array.from({ length: cols }, (_, i) =>
    Array.from({ length: rows }, (_, j) => m[j][cols - 1 - i])
  )
}

/**
 * Collision: true if piece at (pos + move) hits walls, floor, or existing blocks.
 * Фигура останавливается при достижении дна (newY >= ROWS) или поверхности другой фигуры (grid[newY][newX] !== 0).
 */
export function isCollision(
  piece: ActivePiece,
  grid: Grid,
  moveX: number,
  moveY: number
): boolean {
  const { shape, pos } = piece
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const newX = pos.x + x + moveX
        const newY = pos.y + y + moveY
        if (
          newX < 0 ||
          newX >= COLS ||
          newY >= ROWS ||
          (newY >= 0 && grid[newY][newX] !== 0)
        ) {
          return true
        }
      }
    }
  }
  return false
}

/** Merge active piece into grid; return new grid. */
export function mergePieceIntoGrid(grid: Grid, piece: ActivePiece): Grid {
  const next = grid.map(row => [...row])
  const { shape, pos } = piece
  const id = TETROMINOES[piece.type].id
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const gx = pos.x + x
        const gy = pos.y + y
        if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
          next[gy][gx] = id
        }
      }
    }
  }
  return next
}

/** Clear full rows, add empty rows on top. Return { grid, scoreIncrement }. */
export function sweepLines(grid: Grid): { grid: Grid; scoreIncrement: number } {
  let linesCleared = 0
  const filteredGrid = grid.filter(row => {
    if (row.every(cell => cell !== 0)) {
      linesCleared++
      return false
    }
    return true
  })
  while (filteredGrid.length < ROWS) {
    filteredGrid.unshift(Array(COLS).fill(0) as Grid[0])
  }
  return {
    grid: filteredGrid,
    scoreIncrement: LINE_POINTS[Math.min(linesCleared, LINE_POINTS.length - 1)],
  }
}
