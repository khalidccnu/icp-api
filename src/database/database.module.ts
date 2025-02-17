import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigHelper } from '@src/app/helpers';
import { HelpersModule } from '@src/app/helpers/helpers.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [HelpersModule],
      inject: [AppConfigHelper],
      useFactory: (appConfigHelper: AppConfigHelper) => ({
        uri: appConfigHelper.db.uri,
        dbName: appConfigHelper.db.database,
      }),
    }),
  ],
})
export class DatabaseModule {}
