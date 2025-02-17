import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelpersModule } from '../../helpers/helpers.module';
import { JwtIdentityModule } from './jwtIdentity/jwtIdentity.module';

const schemas = [];
const services = [];
const controllers = [];
const webControllers = [];
const modules = [HelpersModule, JwtIdentityModule];

@Module({
  imports: [MongooseModule.forFeature(schemas), ...modules],
  providers: [...services],
  exports: [...services],
  controllers: [...controllers, ...webControllers],
})
export class IdentityModule {}
