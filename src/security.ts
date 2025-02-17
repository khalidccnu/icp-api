import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppConfigHelper } from './app/helpers';

const appConfig = new AppConfigHelper(new ConfigService());
const allowedOrigins = appConfig.security.CORS_ALLOWED_ORIGINS;

export function setupSecurity(app: INestApplication): void {
  app.use(helmet());
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(
    rateLimit({
      windowMs: appConfig.security.RATE_LIMIT_TTL,
      max: appConfig.security.RATE_LIMIT_MAX,
      message: 'Too many requests created from this IP, please try again after 5 minutes',
    })
  );
}
