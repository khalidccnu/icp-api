import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import * as OtpUtil from 'otp-without-db';
import { GenericObject } from '../types';
import { AppConfigHelper } from './appConfig.helper';

@Injectable()
export class JWTHelper {
  constructor(private readonly appConfigHelper: AppConfigHelper) {}

  public sign(payload: GenericObject, options: GenericObject) {
    return sign(payload, this.appConfigHelper.jwt.secret, options);
  }

  public verify(token: string) {
    try {
      return verify(token, this.appConfigHelper.jwt.secret);
    } catch (error) {
      throw new UnauthorizedException('Unauthorized Access Detected');
    }
  }

  public verifyRefreshToken(token: string) {
    try {
      const decoded: any = verify(token, this.appConfigHelper.jwt.secret);
      if (decoded.isRefreshToken) {
        return decoded;
      } else {
        throw new ForbiddenException('Unauthorized Access Detected');
      }
    } catch (error) {
      throw new ForbiddenException('Unauthorized Access Detected');
    }
  }

  public extractToken(headers: GenericObject) {
    let token: string = headers && headers.authorization ? headers.authorization : '';
    token = token.replace(/Bearer\s+/gm, '');

    return token;
  }

  public makeAccessToken(data: GenericObject) {
    const configAccess = {
      payload: {
        ...data,
      },
      options: {
        algorithm: 'HS512',
        expiresIn: this.appConfigHelper.jwt.tokenExpireIn,
      },
    };

    return this.sign(configAccess.payload, configAccess.options);
  }

  public makeRefreshToken(data: GenericObject) {
    const configAccess = {
      payload: {
        ...data,
      },
      options: {
        algorithm: 'HS512',
        expiresIn: this.appConfigHelper.jwt.refreshTokenExpireIn,
      },
    };

    return this.sign(configAccess.payload, configAccess.options);
  }

  public makePermissionToken(data: GenericObject) {
    const configAccess = {
      payload: {
        ...data,
      },
      options: {
        algorithm: 'HS512',
        expiresIn: this.appConfigHelper.jwt.refreshTokenExpireIn,
      },
    };

    return this.sign(configAccess.payload, configAccess.options);
  }

  public generateOtpHash(identifier: string, otp: number): string {
    return OtpUtil.createNewOTP(identifier, otp, this.appConfigHelper.jwt.secret, 5);
  }

  public verifyOtpHash(identifier: string, otp: number, otpHash: string): boolean {
    return OtpUtil.verifyOTP(identifier, otp, otpHash, this.appConfigHelper.jwt.secret);
  }
}
