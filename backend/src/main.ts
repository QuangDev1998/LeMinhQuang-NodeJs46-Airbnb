import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as express from 'express';
async function bootstrap() {
  dotenv.config(); // Load biến môi trường từ .env
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
