import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtIdentityGuard extends AuthGuard('jwt') {
  handleRequest(error, user) {
    if (error || !user) {
      throw new UnauthorizedException('Unauthorized Access Detected');
    }

    return user;
  }
}
