import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelpersModule } from '../../helpers/helpers.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

const schemas = [];
const services = [AuthService];
const controllers = [AuthController];
const webControllers = [];
const modules = [HelpersModule, UserModule];

@Module({
  imports: [MongooseModule.forFeature(schemas), ...modules],
  providers: [...services],
  exports: [...services],
  controllers: [...controllers, ...webControllers],
})
export class AuthModule {}
