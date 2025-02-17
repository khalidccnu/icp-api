import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInfoModule } from '../userInfo/userInfo.module';
import { HelpersModule } from './../../helpers/helpers.module';
import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';

const schemas = [{ name: User.name, schema: UserSchema }];
const services = [UserService];
const controllers = [UserController];
const webControllers = [];
const modules = [HelpersModule, UserInfoModule];

@Module({
  imports: [MongooseModule.forFeature(schemas), ...modules],
  providers: [...services],
  exports: [...services],
  controllers: [...controllers, ...webControllers],
})
export class UserModule {}
