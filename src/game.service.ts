import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class GameService implements OnModuleInit {
    private board: (string | null)[][] = [];
    private currentPlayer: "A" | "B" = "A";

    onModuleInit() {
        this.resetBoard();
    }

    getBoard() {
        return { board: this.board, currentPlayer: this.currentPlayer };
    }

    resetBoard() {
        this.board = Array.from({ length: 5 }, () => Array(5).fill(null));
        this.currentPlayer = "A";
        return{ board: this.board, currentPlayer: this.currentPlayer };
    }
}
