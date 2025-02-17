import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '@src/app/base/base.service';
import { Model } from 'mongoose';
import { UserInfo } from '../schemas/userInfo.schema';

@Injectable()
export class UserInfoService extends BaseService<UserInfo> {
  constructor(
    @InjectModel(UserInfo.name)
    private readonly userInfoModel: Model<UserInfo>
  ) {
    super(userInfoModel);
  }
}
