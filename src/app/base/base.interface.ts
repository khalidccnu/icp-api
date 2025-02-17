import { Document, FilterQuery, UpdateQuery } from 'mongoose';
import { IFindByIdBaseOptions } from '../interfaces';
import { SuccessResponse } from '../types';
import { IFindAllBaseOptions } from './../interfaces/queryOptions.interfaces';

export interface IBaseService<T extends Document> {
  findByIdBase(id: string, options?: IFindByIdBaseOptions): Promise<T>;

  isExist(filters: FilterQuery<T>): Promise<T>;

  findOneBase(filters: FilterQuery<T>, options?: IFindByIdBaseOptions): Promise<T>;

  findAllBase(filters: FilterQuery<T>, options?: IFindAllBaseOptions): Promise<SuccessResponse | T[]>;

  createOneBase(data: T): Promise<T>;

  updateOneBase(id: string, data: UpdateQuery<T>, options?: IFindByIdBaseOptions): Promise<T>;

  deleteOneBase(id: string): Promise<SuccessResponse>;

  softDeleteOneBase(id: string): Promise<SuccessResponse>;

  recoverByIdBase(id: string, options?: IFindByIdBaseOptions): Promise<T>;
}
