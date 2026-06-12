import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Tự động validate & convert payload theo DTO (class-validator/transformer)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CLIENT_URL: 1 domain, hoặc nhiều domain ngăn cách bằng dấu phẩy, hoặc "*"
  // (cho phép mọi origin - dùng cho demo khi frontend đổi host nhiều lần).
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const allowList = clientUrl.split(',').map((s) => s.trim());
  app.enableCors({
    origin:
      clientUrl.trim() === '*'
        ? true
        : (origin, cb) => cb(null, !origin || allowList.includes(origin)),
    credentials: true,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  setupSwagger(app);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
//
