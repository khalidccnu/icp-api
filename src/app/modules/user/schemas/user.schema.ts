import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base, BaseSchema } from '@src/app/base';
import { ENUM_COLLECTION_NAMES, ENUM_FIELD_TYPES } from '@src/shared';

@Schema({ collection: ENUM_COLLECTION_NAMES.USERS })
export class User extends Base {
  public static readonly SEARCH_TERMS: string[] = ['name', 'phone', 'email'];

  @Prop()
  name?: string;

  @Prop({ unique: true })
  phone?: string;

  @Prop({ unique: true, nullable: true })
  email?: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ type: ENUM_FIELD_TYPES.OBJECT_ID, ref: User.name, nullable: true })
  createdBy?: string;

  @Prop({ type: ENUM_FIELD_TYPES.OBJECT_ID, ref: User.name, nullable: true })
  updatedBy?: string;

  constructor() {
    super();
  }
}

export const UserSchema = SchemaFactory.createForClass(User).add(BaseSchema);

UserSchema.statics.getSearchTerms = function () {
  return User.SEARCH_TERMS;
};
