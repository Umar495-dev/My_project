import { PlayerColor } from './types';

// Board is 15x15
export const BOARD_SIZE = 15;

export const PLAYER_COLORS: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];

export const SAFE_SPOTS = [0, 8, 13, 21, 26, 34, 39, 47]; // Indices on the main 52-step path

// Mapping logical path index (0-51) to (x, y) coordinates
// This path starts from Red's start position (index 0) and goes clockwise
export const MAIN_PATH_COORDS: { x: number; y: number }[] = [
  { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, // 0-4
  { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 }, // 5-10
  { x: 7, y: 0 }, { x: 8, y: 0 }, // 11-12
  { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, // 13-17
  { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 }, // 18-23
  { x: 14, y: 7 }, { x: 14, y: 8 }, // 24-25
  { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }, { x: 9, y: 8 }, // 26-30
  { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 }, // 31-36
  { x: 7, y: 14 }, { x: 6, y: 14 }, // 37-38
  { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }, { x: 6, y: 9 }, // 39-43
  { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }, { x: 0, y: 8 }, // 44-49
  { x: 0, y: 7 }, { x: 0, y: 6 } // 50-51 (Loop closes back to 0 at {1,6})
];

// Home paths for each color (5 steps into the center)
export const HOME_PATHS: Record<PlayerColor, { x: number; y: number }[]> = {
  red:    [{ x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }],
  green:  [{ x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }],
  yellow: [{ x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }],
  blue:   [{ x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }, { x: 7, y: 8 }],
};

export const START_OFFSETS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

// Base positions (visual only, for pieces in waiting area)
export const BASE_POSITIONS: Record<PlayerColor, { x: number; y: number }[]> = {
  red:    [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 1, y: 4 }, { x: 4, y: 4 }],
  green:  [{ x: 10, y: 1 }, { x: 13, y: 1 }, { x: 10, y: 4 }, { x: 13, y: 4 }],
  yellow: [{ x: 10, y: 10 }, { x: 13, y: 10 }, { x: 10, y: 13 }, { x: 13, y: 13 }],
  blue:   [{ x: 1, y: 10 }, { x: 4, y: 10 }, { x: 1, y: 13 }, { x: 4, y: 13 }],
};