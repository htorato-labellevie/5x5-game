import { Controller, Get, Post, Body } from '@nestjs/common';
import { GameService } from '../../../application/service/game.service';
import { BoardState, MoveRequest } from '../../../domain/model/game.types';
import { ApiResponse } from '../../../common/types/api-response';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getBoard(): ApiResponse<BoardState> {
    return this.gameService.getBoard();
  }

  @Post('reset')
  resetBoard(): ApiResponse<BoardState> {
    return this.gameService.resetBoard();
  }

  @Post('move')
  makeMove(@Body() body: MoveRequest): ApiResponse<BoardState> {
    return this.gameService.makeMove(body);
  }

  // 👇 プレイヤー名を登録/更新し、訪問回数を返すエンドポイント
  @Post('register')
  async registerPlayer(@Body() body: { name: string }): Promise<{ success: boolean; visits: number }> {
    const visits = await this.gameService.registerPlayer(body.name);
    return { success: true, visits };
  }
}
