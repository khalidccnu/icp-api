import { BadRequestException, Injectable } from '@nestjs/common';
import { AppConfigHelper, BcryptHelper } from '@src/app/helpers';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { User } from '../../user/schemas/user.schema';
import { LoginDTO, RegisterDTO } from '../dtos';
import { ChangePasswordDTO } from '../dtos/changePassword.dto';
import { JWTHelper } from './../../../helpers/jwt.helper';
import { UserService } from './../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtHelper: JWTHelper,
    private readonly bcryptHelper: BcryptHelper,
    private readonly appConfigHelper: AppConfigHelper
  ) {}

  async login(payload: LoginDTO): Promise<SuccessResponse> {
    const user = await this.userService.findInv(payload);

    const tokenPayload = {
      user: {
        id: user._id.toString(),
      },
    };

    const token = this.jwtHelper.makeAccessToken(tokenPayload);

    return new SuccessResponse('Login successfully', {
      token,
      user: this.appConfigHelper.isProduction ? null : { ...tokenPayload.user },
    });
  }

  async register(payload: RegisterDTO): Promise<SuccessResponse> {
    if (this.appConfigHelper.isProduction) {
      throw new BadRequestException('Registration is not allowed');
    }

    const user = await this.userService.create(null, payload as any, this.appConfigHelper.isProduction ? null : []);
    return new SuccessResponse('User registered successfully', user);
  }

  async profile(authUser: IAuthUser, relations: string[]): Promise<User> {
    return this.userService.findByIdBase(authUser.id, { relations });
  }

  async changePassword(authUser: IAuthUser, payload: ChangePasswordDTO): Promise<SuccessResponse> {
    const { currentPassword, newPassword } = payload;

    const user = await this.userService.model.findOne({ _id: authUser.id }).select('_id password').exec();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordMatched = await this.bcryptHelper.compareHash(currentPassword, user.password);

    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid old password');
    }

    await this.userService.updateOneBase(authUser.id, { password: await this.bcryptHelper.hash(newPassword) });

    return new SuccessResponse('Password changed successfully');
  }
}
