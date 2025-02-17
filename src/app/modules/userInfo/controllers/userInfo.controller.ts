import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { JwtIdentityGuard } from '../../identity/jwtIdentity/jwtIdentity.guard';
import { CreateUserInfoDTO } from '../dtos/userInfo/create.dto';
import { FilterUserInfoDTO } from '../dtos/userInfo/filter.dto';
import { UpdateUserInfoDTO } from '../dtos/userInfo/update.dto';
import { UserInfo } from '../schemas/userInfo.schema';
import { UserInfoService } from '../services/userInfo.service';

@ApiExcludeController()
@ApiTags('User Info')
@ApiBearerAuth()
@UseGuards(JwtIdentityGuard)
@Controller('users-info')
export class UserInfoController {
  RELATIONS = [];
  constructor(private readonly userInfoService: UserInfoService) {}

  @Get()
  async findAll(@Query() query: FilterUserInfoDTO): Promise<SuccessResponse | UserInfo[]> {
    return this.userInfoService.findAllBase(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserInfo> {
    return this.userInfoService.findByIdBase(id);
  }

  @Post()
  async createOne(@Body() body: CreateUserInfoDTO): Promise<UserInfo> {
    return this.userInfoService.createOneBase(body as any);
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() body: UpdateUserInfoDTO): Promise<UserInfo> {
    return this.userInfoService.updateOneBase(id, body);
  }
}
