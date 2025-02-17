import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelpersModule } from './../../helpers/helpers.module';
import { UserInfoController } from './controllers/userInfo.controller';
import { UserInfo, UserInfoSchema } from './schemas/userInfo.schema';
import { UserInfoService } from './services/userInfo.service';

const schemas = [{ name: UserInfo.name, schema: UserInfoSchema }];
const services = [UserInfoService];
const controllers = [UserInfoController];
const webControllers = [];
const modules = [HelpersModule];

@Module({
  imports: [MongooseModule.forFeature(schemas), ...modules],
  providers: [...services],
  exports: [...services],
  controllers: [...controllers, ...webControllers],
})
export class UserInfoModule {}
