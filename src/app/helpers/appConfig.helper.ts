import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { toNumber } from '@src/shared';

@Injectable()
export class AppConfigHelper {
  constructor(private readonly configService: ConfigService) {}

  private readonly ENV_DEVELOPMENT = 'development';
  private readonly ENV_STAGING = 'staging';
  private readonly ENV_PRODUCTION = 'production';

  get port(): string {
    return this.configService.get<string>('PORT');
  }

  get env(): string {
    return this.configService.get<string>('APP_ENV');
  }

  get isDevelopment(): boolean {
    return this.env === this.ENV_DEVELOPMENT;
  }

  get isStaging(): boolean {
    return this.env === this.ENV_STAGING;
  }

  get isProduction(): boolean {
    return this.env === this.ENV_PRODUCTION;
  }

  get api() {
    return {
      API_HOST: this.configService.get<string>('API_HOST'),
      API_PREFIX: this.configService.get<string>('API_PREFIX'),
      API_VERSION: this.configService.get<string>('API_VERSION'),
      API_TITLE: this.configService.get<string>('API_TITLE'),
      API_DESCRIPTION: this.configService.get<string>('API_DESCRIPTION'),
    };
  }

  get security() {
    return {
      CORS_ALLOWED_ORIGINS: this.configService.get<string>('CORS_ALLOWED_ORIGINS')?.split(',') || [],
      RATE_LIMIT_TTL: toNumber(this.configService.get<string>('RATE_LIMIT_TTL')),
      RATE_LIMIT_MAX: toNumber(this.configService.get<string>('RATE_LIMIT_MAX')),
    };
  }

  get jwt() {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      saltRound: toNumber(this.configService.get<string>('JWT_SALT_ROUNDS')),
      tokenExpireIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      refreshTokenExpireIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    };
  }

  get folder() {
    return {
      LOG: this.configService.get<string>('LOG_FOLDER'),
      BACKUP: this.configService.get<string>('BACKUP_FOLDER'),
      UPLOAD: this.configService.get<string>('UPLOAD_FOLDER'),
    };
  }

  get db() {
    return {
      uri: this.configService.get<string>('DB_URI'),
      database: this.configService.get<string>('DB_DATABASE'),
    };
  }
}
