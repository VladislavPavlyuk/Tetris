import type { TetrominoKey } from '../types/tetris'

/** Shape = 2D matrix (1 = block, 0 = empty). Color and numeric id for grid merge. */
export const TETROMINOES: Record<
  TetrominoKey,
  { shape: number[][]; color: string; id: number }
> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0f0',
    id: 1,
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000f0',
    id: 2,
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#f0a000',
    id: 3,
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000',
    id: 4,
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00f000',
    id: 5,
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#a000f0',
    id: 6,
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f00000',
    id: 7,
  },
}

/** Scoring: 0, 1, 2, 3, 4 lines cleared -> points */
export const LINE_POINTS = [0, 100, 300, 500, 800] as const

/** Id (1–7) to color for rendering grid cells */
export const ID_TO_COLOR: Record<number, string> = Object.fromEntries(
  (Object.entries(TETROMINOES) as [TetrominoKey, (typeof TETROMINOES)[TetrominoKey]][])
    .map(([, t]) => [t.id, t.color])
)
