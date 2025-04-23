import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORSの有効化（ローカルIP・localhost・Vercelを許可）
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://192.168.11.5:5173',
      'https://5x5-game.vercel.app',
    ],
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
