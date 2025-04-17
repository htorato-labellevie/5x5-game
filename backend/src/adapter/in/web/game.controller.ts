import { Controller, Get, Post, Body } from '@nestjs/common';
import { GameService } from '../../../application/service/game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getBoard() {
    return this.gameService.getBoard();
  }

  @Post('reset')
  resetBoard() {
    return this.gameService.resetBoard();
  }
}
