import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base, BaseSchema } from '@src/app/base';
import { ENUM_COLLECTION_NAMES, ENUM_FIELD_TYPES } from '@src/shared';
import { User } from '../../user/schemas/user.schema';
import { BloodGroupType } from '../enums/userInfo.enum';

@Schema({ collection: ENUM_COLLECTION_NAMES.USERS_INFO })
export class UserInfo extends Base {
  public static readonly SEARCH_TERMS: string[] = [];

  @Prop({ type: ENUM_FIELD_TYPES.DATE, default: null })
  birthday?: Date;

  @Prop({ default: null })
  bloodGroup?: BloodGroupType;

  @Prop({ type: ENUM_FIELD_TYPES.OBJECT_ID, ref: 'User' })
  user?: User;

  constructor() {
    super();
  }
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo).add(BaseSchema);

UserInfoSchema.statics.getSearchTerms = function () {
  return UserInfo.SEARCH_TERMS;
};
