import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/app/decorators';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { JwtIdentityGuard } from '../../identity/jwtIdentity/jwtIdentity.guard';
import { User } from '../../user/schemas/user.schema';
import { LoginDTO, RegisterDTO } from '../dtos';
import { ChangePasswordDTO } from '../dtos/changePassword.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  RELATIONS = [];
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtIdentityGuard)
  @Get('profile')
  async profile(@AuthUser() authUser: IAuthUser): Promise<User> {
    return this.authService.profile(authUser, this.RELATIONS);
  }

  @ApiBearerAuth()
  @UseGuards(JwtIdentityGuard)
  @Patch('change-password')
  async changePassword(@AuthUser() authUser: IAuthUser, @Body() body: ChangePasswordDTO): Promise<SuccessResponse> {
    return this.authService.changePassword(authUser, body);
  }
}
