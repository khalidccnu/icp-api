import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/app/decorators';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { JwtIdentityGuard } from '../../identity/jwtIdentity/jwtIdentity.guard';
import { CreateUserDTO, FilterUserDTO, UpdateUserDTO } from '../dtos';
import { User } from '../schemas/user.schema';
import { UserService } from '../services/user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtIdentityGuard)
@Controller('users')
export class UserController {
  RELATIONS = ['userInfo', 'createdBy', 'updatedBy'];
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: FilterUserDTO): Promise<SuccessResponse | User[]> {
    const { startDate, endDate, ...restQuery } = query;
    const newQuery: any = { ...restQuery };

    if (startDate && endDate) {
      newQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    return this.userService.findAllBase(newQuery, {
      relations: this.RELATIONS,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.userService.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@AuthUser() authUser: IAuthUser, @Body() body: CreateUserDTO): Promise<User> {
    return this.userService.create(authUser, body, this.RELATIONS);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @AuthUser() authUser: IAuthUser,
    @Body() body: UpdateUserDTO
  ): Promise<User> {
    return this.userService.update(id, authUser, body, this.RELATIONS);
  }
}
