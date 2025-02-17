import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { utilities, WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';
import { AppConfigHelper } from './app/helpers';

const appConfig = new AppConfigHelper(new ConfigService());

export function createLogger(): LoggerService {
  const winstonOptions: WinstonModuleOptions = {
    transports: [
      new transports.Console({
        format: format.combine(format.timestamp(), utilities.format.nestLike()),
        level: 'debug',
      }),
      new transports.File({
        format: format.combine(format.timestamp(), utilities.format.nestLike()),
        filename: `${appConfig.folder.LOG}/errors.log`,
        level: 'error',
      }),
      new transports.File({
        format: format.combine(format.timestamp(), utilities.format.nestLike()),
        filename: `${appConfig.folder.LOG}/warnings.log`,
        level: 'warning',
      }),
      new transports.File({
        format: format.combine(format.timestamp(), utilities.format.nestLike()),
        filename: `${appConfig.folder.LOG}/critical.log`,
        level: 'crit',
      }),
      new transports.File({
        format: format.combine(format.timestamp(), utilities.format.nestLike()),
        filename: `${appConfig.folder.LOG}/log.log`,
        level: 'log',
      }),
    ],
  };

  return WinstonModule.createLogger(winstonOptions);
}
