export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type PlayerType = 'human' | 'cpu';

export interface Piece {
  id: number;
  color: PlayerColor;
  position: number; // -1 = base, 0-51 = main track, 52-57 = home stretch, 99 = finished
  stepsMoved: number;
}

export interface Player {
  color: PlayerColor;
  pieces: Piece[];
  hasFinished: boolean;
  name: string;
  type: PlayerType;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number; // Index in the players array
  diceValue: number | null;
  phase: 'ROLL' | 'MOVE' | 'WIN';
  lastRollWasSix: boolean;
  consecutiveSixes: number;
  winner: PlayerColor | null;
  history: string[]; 
}

export interface Coordinate {
  x: number; // Column (0-14)
  y: number; // Row (0-14)
}

export interface CommentaryMessage {
  text: string;
  sender: 'ai' | 'system';
}