import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { GameGateway } from '../../adapter/in/websocket/game.gateway';
import { BoardState, Player, MoveRequest } from '../../domain/model/game.types';
import { ApiResponse } from '../../common/types/api-response';
import { PlayerRepository } from '../../domain/port/out/player-repository.port';

@Injectable()
export class GameService implements OnModuleInit {
  private board: (Player | null)[][] = [];
  private currentPlayer: Player = "A";

  constructor(
    private readonly gameGateway: GameGateway,
    @Inject('PlayerRepository')
    private readonly playerRepository: PlayerRepository,
  ) {}

  onModuleInit() {
    this.resetBoard();
  }

  getBoard(): ApiResponse<BoardState> {
    return {
      success: true,
      data: {
        board: this.board,
        currentPlayer: this.currentPlayer,
        winner: null,
      },
    };
  }

  resetBoard(): ApiResponse<BoardState> {
    this.board = Array.from({ length: 15 }, () => Array(15).fill(null));
    this.currentPlayer = "A";

    this.gameGateway.emitBoardUpdate(this.board, this.currentPlayer, null);

    return {
      success: true,
      data: {
        board: this.board,
        currentPlayer: this.currentPlayer,
        winner: null,
      },
    };
  }

  makeMove(body: MoveRequest): ApiResponse<BoardState> {
    const { X, Y, player } = body;

    if (this.board[Y][X] !== null || this.currentPlayer !== player) {
      return {
        success: false,
        error: "無効な操作です",
      };
    }

    this.board[Y][X] = player;
    const winner = this.checkWinner(Y, X, player);

    if (winner) {
      this.gameGateway.emitBoardUpdate(this.board, this.currentPlayer, winner);
      return {
        success: true,
        data: {
          board: this.board,
          currentPlayer: this.currentPlayer,
          winner,
        },
      };
    }

    this.currentPlayer = player === "A" ? "B" : "A";
    this.gameGateway.emitBoardUpdate(this.board, this.currentPlayer, null);

    return {
      success: true,
      data: {
        board: this.board,
        currentPlayer: this.currentPlayer,
        winner: null,
      },
    };
  }

  private checkWinner(y: number, x: number, player: Player): Player | "Draw" | null {
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
          ny >= 0 && ny < this.board.length &&
          nx >= 0 && nx < this.board[0].length &&
          this.board[ny][nx] === player
        ) {
          count++;
          ny += dy;
          nx += dx;
        }
      }

      if (count >= 5) return player;
    }

    const isDraw = this.board.flat().every(cell => cell !== null);
    return isDraw ? "Draw" : null;
  }

  /**
   * 🔐 プレイヤー名を登録し、訪問回数を返す
   */
  async registerPlayer(name: string): Promise<number> {
    const player = await this.playerRepository.findByName(name);

    if (player) {
      const newCount = player.visits + 1;
      await this.playerRepository.updateVisits(name, newCount);
      return newCount;
    } else {
      await this.playerRepository.create({ name, visits: 1 });
      return 1;
    }
  }
}
