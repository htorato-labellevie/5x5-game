import { Module } from '@nestjs/common';
import { GameService } from './application/service/game.service';
import { GameController } from './adapter/in/web/game.controller';
import { GameGateway } from './adapter/in/websocket/game.gateway';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class AppModule {}
