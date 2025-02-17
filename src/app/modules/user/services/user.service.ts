import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { BaseService } from '@src/app/base/base.service';
import { BcryptHelper } from '@src/app/helpers';
import { IAuthUser } from '@src/app/interfaces';
import { ClientSession, Connection, Model } from 'mongoose';
import { LoginDTO } from '../../auth/dtos';
import { UserInfoService } from '../../userInfo/services/userInfo.service';
import { CreateUserDTO, UpdateUserDTO } from '../dtos';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly userInfoService: UserInfoService,
    private readonly bcryptHelper: BcryptHelper,
    @InjectConnection()
    private readonly connection: Connection
  ) {
    super(userModel);
  }

  async findInv(payload: LoginDTO): Promise<User> {
    const user = await this.userModel
      .findOne({ phone: payload.phone })
      .select('_id phone email password isActive')
      .exec();

    if (!user) throw new BadRequestException('User does not exist');

    const isPasswordMatch = await this.bcryptHelper.compareHash(payload.password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Password does not match');
    }

    if (!user.isActive) {
      throw new BadRequestException('User not active');
    }

    return user;
  }

  async create(authUser: IAuthUser, payload: CreateUserDTO, relations?: string[]): Promise<User> {
    const isExist = await this.userModel.findOne({ phone: payload.phone });

    if (isExist) throw new ConflictException('Phone already exists');

    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

    let createdUser = null;
    const { name, phone, email, password, isActive, ...rest } = payload;
    const userPayload = {
      name,
      phone,
      email,
      password: await this.bcryptHelper.hash(password),
      isActive,
      createdBy: authUser?.id,
    };

    try {
      createdUser = await this.userModel.create([userPayload], { session });
      const createdUserInfo = await this.userInfoService.model.create([{ ...rest, user: createdUser[0]._id }], {
        session,
      });

      createdUser[0].userInfo = createdUserInfo[0]._id;
      await createdUser[0].save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error.message || 'User not created');
    } finally {
      await session.endSession();
    }

    return relations ? this.findByIdBase(createdUser.id, { relations }) : null;
  }

  async update(id: string, authUser: IAuthUser, payload: UpdateUserDTO, relations: string[]): Promise<User> {
    const user = await this.findByIdBase(id);

    if (!user) throw new NotFoundException('User does not exist');

    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

    const { name, phone, email, password, isActive, ...rest } = payload;
    const userPayload = {
      name,
      phone,
      email,
      isActive,
      updatedBy: authUser?.id,
      ...(password && { password: await this.bcryptHelper.hash(password) }),
    };

    try {
      await this.userModel.updateOne({ _id: id }, { $set: userPayload }, { session });
      await this.userInfoService.model.updateOne({ user: id }, { $set: rest }, { session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error.message || 'User not updated');
    } finally {
      await session.endSession();
    }

    return this.findByIdBase(id, { relations });
  }
}
