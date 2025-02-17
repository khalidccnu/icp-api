import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '@src/app/base/base.service';
import { BcryptHelper } from '@src/app/helpers';
import { IAuthUser } from '@src/app/interfaces';
import { Model } from 'mongoose';
import { LoginDTO } from '../../auth/dtos';
import { CreateUserDTO, UpdateUserDTO } from '../dtos';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly bcryptHelper: BcryptHelper
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

    const { password, ...rest } = payload;
    let createdUser: User = null;

    try {
      createdUser = await this.userModel.create({
        ...rest,
        password: await this.bcryptHelper.hash(password),
        createdBy: authUser?.id,
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'User not created');
    }

    return relations ? this.findByIdBase(createdUser.id, { relations }) : null;
  }

  async update(id: string, authUser: IAuthUser, payload: UpdateUserDTO, relations: string[]): Promise<User> {
    const user = await this.findByIdBase(id);

    if (!user) throw new NotFoundException('User does not exist');

    const { password, ...rest } = payload;

    try {
      await this.updateOneBase(id, {
        ...rest,
        ...(password ? { password: await this.bcryptHelper.hash(password) } : {}),
        updatedBy: authUser?.id,
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'User not updated');
    }

    return this.findByIdBase(id, { relations });
  }
}
