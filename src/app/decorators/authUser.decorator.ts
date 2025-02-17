import { createParamDecorator } from '@nestjs/common';
import { IAuthUser } from '../interfaces';

export const AuthUser = createParamDecorator((data, req): IAuthUser => {
  return req.args[0].user;
});
