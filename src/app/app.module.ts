import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from '@src/database/database.module';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionFilter } from './filters';
import { AppConfigHelper } from './helpers';
import { HelpersModule } from './helpers/helpers.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { IdentityModule } from './modules/identity/identity.module';
import { UserModule } from './modules/user/user.module';

const appConfig = new AppConfigHelper(new ConfigService());

const COMMON_MODULES = [
  HttpModule,
  CacheModule.register({ isGlobal: true }),
  ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true,
  }),
  // eslint-disable-next-line no-undef
  MulterModule.register({ dest: join(process.cwd(), appConfig.folder.UPLOAD) }),
  ServeStaticModule.forRoot({
    // eslint-disable-next-line no-undef
    rootPath: join(process.cwd(), appConfig.folder.UPLOAD),
  }),
  ...(appConfig.isDevelopment ? [] : [ScheduleModule.forRoot()]),
];

const FEATURE_MODULES = [HelpersModule, DatabaseModule, IdentityModule, AuthModule, UserModule];

const MODULES = [...COMMON_MODULES, ...FEATURE_MODULES];

@Module({
  imports: [...MODULES],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
