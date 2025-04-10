import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      // Khi whitelist: true, NestJS tự động loại bỏ các thuộc tính không có trong DTO
      whitelist: true,

      // Báo lỗi khi truyền trường không có trong DTO
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });
  // Dùng đặt một tiền tố (prefix) toàn cục cho tất cả các route trong ứng dụng.
  app.setGlobalPrefix('api/v1', { exclude: [''] });

  await app.listen(port ?? 8080);
}

bootstrap();
