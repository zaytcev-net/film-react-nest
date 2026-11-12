import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppConfig } from './app.config.provider';

import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

function createLogger(loggerType: string) {
  switch (loggerType) {
    case 'json':
      return new JsonLogger();

    case 'tskv':
      return new TskvLogger();

    case 'dev':
    default:
      return new DevLogger();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = app.get<AppConfig>('CONFIG');

  const logger = createLogger(process.env.LOGGER_TYPE ?? 'dev');

  app.useLogger(logger);

  app.setGlobalPrefix('api/afisha');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(config.port);
}

bootstrap();
