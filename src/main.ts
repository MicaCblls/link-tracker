import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipUndefinedProperties: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser .urlencoded({ limit: '10mb', extended: true }));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();