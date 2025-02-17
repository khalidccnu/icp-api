import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type JwtPayload = {
  user: {
    id: string;
  };
  iat: number;
  exp: number;
};

@Injectable()
export class JwtIdentityStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) token = req.cookies['jwt'];

      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.user.id };
  }
}
