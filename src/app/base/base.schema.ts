import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ENUM_FIELD_TYPES } from '@src/shared';
import { Document } from 'mongoose';

@Schema({
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Base extends Document {
  @Prop({ type: ENUM_FIELD_TYPES.BOOLEAN, default: true })
  isActive?: boolean;

  @Prop({ type: ENUM_FIELD_TYPES.DATE, default: Date.now })
  createdAt?: Date;

  @Prop({ type: ENUM_FIELD_TYPES.DATE, default: Date.now })
  updatedAt?: Date;

  @Prop({ type: ENUM_FIELD_TYPES.DATE, select: false, default: null })
  deletedAt?: Date;
}

export const BaseSchema = SchemaFactory.createForClass(Base);

BaseSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = this.updatedAt = new Date();
  } else {
    this.updatedAt = new Date();
  }

  next();
});

BaseSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });

  next();
});

BaseSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });

  next();
});

BaseSchema.pre('deleteOne', function (next) {
  this.set({ deletedAt: new Date() });

  next();
});

BaseSchema.pre('findOneAndDelete', function (next) {
  this.set({ deletedAt: new Date() });

  next();
});

BaseSchema.methods.softDelete = async function () {
  await this.model(this.constructor.modelName).updateOne({ _id: this._id }, { deletedAt: new Date(), isActive: false });
};
