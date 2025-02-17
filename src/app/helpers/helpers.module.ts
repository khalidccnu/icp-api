import { Module } from '@nestjs/common';
import { AppConfigHelper } from './appConfig.helper';
import { BcryptHelper } from './bcrypt.helper';
import { JWTHelper } from './jwt.helper';

const HELPERS = [AppConfigHelper, BcryptHelper, JWTHelper];

@Module({
  providers: [...HELPERS],
  exports: [...HELPERS],
})
export class HelpersModule {}
