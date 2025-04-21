import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔧 CORSの有効化（任意オリジンからのアクセスを許可）
  app.enableCors({
    origin: true,          // または ['http://localhost:5173', 'https://xxxx.ngrok-free.app'] のように明示的に許可
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0'); // 外部からもアクセス可能にする
}
bootstrap();
