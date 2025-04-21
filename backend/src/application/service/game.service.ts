import { Injectable, OnModuleInit } from "@nestjs/common";
import { GameGateway } from '../../adapter/in/websocket/game.gateway';

@Injectable()
export class GameService implements OnModuleInit {
  private board: (string | null)[][] = [];
  private currentPlayer: "A" | "B" = "A";

  constructor(private readonly gameGateway: GameGateway) {}

  onModuleInit() {
    this.resetBoard();
  }

  getBoard() {
    return { board: this.board, currentPlayer: this.currentPlayer };
  }

  resetBoard() {
    this.board = Array.from({ length: 5 }, () => Array(5).fill(null));
    this.currentPlayer = "A";

    // 🔁 リセット時には勝者はいない
    this.gameGateway.emitBoardUpdate(this.board, this.currentPlayer, null);

    return { board: this.board, currentPlayer: this.currentPlayer };
  }

  makeMove(Y: number, X: number, player: string) {
    if (this.board[Y][X] !== null || this.currentPlayer !== player) {
      return { success: false };
    }

    this.board[Y][X] = player;
    const winner = this.checkWinner(Y, X, player);

    if (winner) {
      // ✅ 勝敗がついたときも全員に送信（winner あり）
      this.gameGateway.emitBoardUpdate(this.board, this.currentPlayer, winner);
      return {
        success: true,
        board: this.board,
        currentPlayer: this.currentPlayer,
        winner,
      };
    }

    // プレイヤー交代
    this.currentPlayer = player === "A" ? "B" : "A";

    // ✅ 通常の手でも winner=null で送信
    this.gameGateway.emitBoardUpdate(this.board, this.currentPlayer, null);

    return {
      success: true,
      board: this.board,
      currentPlayer: this.currentPlayer,
      winner: null,
    };
  }

  private checkWinner(y: number, x: number, player: string): string | null {
    const directions: [number, number][][] = [
      [[0, 1], [0, -1]],
      [[1, 0], [-1, 0]],
      [[1, 1], [-1, -1]],
      [[1, -1], [-1, 1]],
    ];

    for (const direction of directions) {
      let count = 1;

      for (const [dy, dx] of direction) {
        let ny = y + dy;
        let nx = x + dx;

        while (
          ny >= 0 && ny < 5 &&
          nx >= 0 && nx < 5 &&
          this.board[ny][nx] === player
        ) {
          count++;
          ny += dy;
          nx += dx;
        }
      }

      if (count >= 5) {
        return player;
      }
    }

    const isDraw = this.board.flat().every(cell => cell !== null);
    return isDraw ? "Draw" : null;
  }
}
