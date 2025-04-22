export type Player = "A" | "B";

export interface BoardState {
  board: (Player | null)[][];
  currentPlayer: Player;
  winner?: Player | "Draw" | null;
}

export interface MoveRequest {
  X: number;
  Y: number;
  player: Player;
}
