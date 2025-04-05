import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // Load biến môi trường từ .env
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  });

  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
