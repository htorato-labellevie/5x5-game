import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server!: Server;

  emitBoardUpdate(board: (string | null)[][], currentPlayer: string, winner: string | null) {
    this.server.emit('boardUpdated', { board, currentPlayer, winner });
  }
}
