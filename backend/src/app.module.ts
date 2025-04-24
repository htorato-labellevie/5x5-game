// app.module.ts
import { Module } from '@nestjs/common';
import { GameService } from './application/service/game.service';
import { GameController } from './adapter/in/web/game.controller';
import { GameGateway } from './adapter/in/websocket/game.gateway';
import { PlayerRepositoryImpl } from './infrastructure/repository/player.repository.impl';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService, GameGateway, { provide: 'PlayerRepository', useClass: PlayerRepositoryImpl }],
})
export class AppModule {}
