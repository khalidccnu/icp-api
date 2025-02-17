import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'body-parser';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { AppConfigHelper } from './app/helpers';
import { createLogger } from './logger';
import { setupSecurity } from './security';
import { setupSwagger } from './swagger';

const appConfig = new AppConfigHelper(new ConfigService());
const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: appConfig.isProduction ? createLogger() : ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  // eslint-disable-next-line no-undef
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('hbs');

  app.use(urlencoded({ extended: true }));
  app.use(
    json({
      limit: '10mb',
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.setGlobalPrefix(appConfig.api.API_PREFIX);

  setupSecurity(app);
  if (!appConfig.isProduction) setupSwagger(app);

  await app.listen(appConfig.port);

  logger.log(`Application is running on: ${await app.getUrl()} 🚀🚀🚀🚀`);
  if (!appConfig.isProduction) {
    logger.log(`Documentation is available on: ${await app.getUrl()}/docs 📖📖📖`);
  }
}

bootstrap();
