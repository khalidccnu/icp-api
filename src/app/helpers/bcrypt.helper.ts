import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { AppConfigHelper } from './appConfig.helper';

@Injectable()
export class BcryptHelper {
  constructor(private readonly appConfigHelper: AppConfigHelper) {}

  public hash(plainText: string, saltRounds: number = this.appConfigHelper.jwt.saltRound) {
    return hash(plainText, saltRounds);
  }

  public compareHash(plainText: string, hashString: string) {
    return compare(plainText, hashString);
  }
}
