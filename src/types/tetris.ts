/** 10 cols × 20 rows; grid[y][x], (0,0) top-left. 0 = empty, 1–7 = tetromino id (color) */
export type Grid = number[][]

export const COLS = 10
export const ROWS = 20

export type TetrominoKey = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z'

/** Active piece: type, current shape matrix (after rotations), position (top-left of shape in grid) */
export interface ActivePiece {
  type: TetrominoKey
  shape: number[][]
  pos: { x: number; y: number }
}
