import { Piece, PlayerColor, Coordinate } from '../types';
import { MAIN_PATH_COORDS, HOME_PATHS, START_OFFSETS, BASE_POSITIONS } from '../constants';

export const getPieceCoordinates = (piece: Piece): Coordinate => {
  // If in base
  if (piece.position === -1) {
    // Determine which of the 4 base spots this piece occupies based on its ID (0-3)
    const baseIndex = piece.id % 4;
    return BASE_POSITIONS[piece.color][baseIndex];
  }

  // If finished
  if (piece.position === 99) {
    // Center of board roughly
    // We can put them in the triangle home area
    const homeCoords: Record<PlayerColor, Coordinate> = {
        red: { x: 6, y: 7 },
        green: { x: 7, y: 6 },
        yellow: { x: 8, y: 7 },
        blue: { x: 7, y: 8 }
    };
    return homeCoords[piece.color];
  }

  // If in Home Stretch
  if (piece.stepsMoved > 50) {
    const homeIndex = piece.stepsMoved - 51; // 0 to 5
    if (homeIndex < 6) {
        return HOME_PATHS[piece.color][homeIndex];
    }
    // Should be 99 if > 5, but for safety:
    return HOME_PATHS[piece.color][5]; 
  }

  // Main Track
  const startOffset = START_OFFSETS[piece.color];
  // Calculate absolute index on the 52-step circle
  const absoluteIndex = (piece.position + startOffset) % 52;
  return MAIN_PATH_COORDS[absoluteIndex];
};

export const canMovePiece = (piece: Piece, diceRoll: number): boolean => {
  if (piece.position === 99) return false; // Already finished

  // Must roll 6 to leave base
  if (piece.position === -1) {
    return diceRoll === 6;
  }

  // Check if move exceeds home run
  // Total steps to finish is 56 (50 main + 6 home)
  // piece.stepsMoved starts at 0 (when on board at start square)
  // Actually, let's say stepsMoved 0 = Start Square.
  // 50 steps -> Reach entrance of home.
  // 51-56 -> Home stretch.
  // 56 -> Goal.
  if (piece.stepsMoved + diceRoll > 56) {
    return false;
  }

  return true;
};
