import { NotFoundException } from '@nestjs/common';
import { IBaseService } from '@src/app/base';
import { toNumber } from '@src/shared';
import { Document, FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { IFindAllBaseOptions, IFindByIdBaseOptions } from '../interfaces';
import { SuccessResponse } from '../types';

export abstract class BaseService<T extends Document> implements IBaseService<T> {
  constructor(public model: Model<T>) {}

  public async count(filters?: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filters);
  }

  public async isExist(filters: FilterQuery<T>): Promise<T> {
    const isExist = await this.model.findOne(filters).exec();

    if (!isExist) {
      throw new NotFoundException(`${this.model.modelName} Not Found`);
    }
    return isExist;
  }

  public async find(filters?: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
    return this.model.find(filters, null, options).exec();
  }

  public async findOne(filters: FilterQuery<T>, options?: QueryOptions): Promise<T> {
    return this.model.findOne(filters, null, options).exec();
  }

  public async save(schemas: T[]): Promise<T[]> {
    return this.model.insertMany(schemas);
  }

  async findByIdBase(id: string, options?: IFindByIdBaseOptions): Promise<T> {
    return this.model.findById(id, null, options).exec();
  }

  async findOneBase(filters: FilterQuery<T>, options?: IFindByIdBaseOptions): Promise<T> {
    return this.model.findOne(filters, null, options).exec();
  }

  async findAllBase(
    filters: FilterQuery<T> & {
      searchTerm?: string;
      limit?: number;
      page?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
    options?: IFindAllBaseOptions
  ): Promise<SuccessResponse | T[]> {
    const { sortBy = 'createdAt', sortOrder = 'ASC', searchTerm, limit = 10, page = 1, ...queryOptions } = filters;

    const skip = (toNumber(page) - 1) * toNumber(limit);

    const query: FilterQuery<T> = {};

    for (const key in queryOptions) {
      if (this.model.schema.path(key) && this.model.schema.path(key).instance === 'ObjectID') {
        (query as any)[key] = queryOptions[key];
      } else {
        (query as any)[key] = queryOptions[key];
      }
    }

    if (searchTerm) {
      const SEARCH_TERMS: string[] = (this.model.schema.statics as any).getSearchTerms() || [];

      const searchQuery = SEARCH_TERMS.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));

      query.$or = searchQuery as FilterQuery<T>[];
    }

    const sort: [string, 'asc' | 'desc'][] = [[sortBy, sortOrder.toLowerCase() as 'asc' | 'desc']];

    const dbQuery = this.model.find(query).sort(sort);

    if (options?.relations?.length) {
      options.relations.forEach((relation) => dbQuery.populate(relation));
    }

    if (options?.withoutPaginate) {
      const data = await dbQuery.exec();
      return data;
    } else {
      const [data, total] = await Promise.all([
        dbQuery.skip(skip).limit(toNumber(limit)).exec(),
        this.model.countDocuments(query),
      ]);

      return new SuccessResponse(`${this.model.modelName} fetched successfully`, data, {
        total,
        page: toNumber(page),
        limit: toNumber(limit),
        skip,
      });
    }
  }

  async createOneBase(data: T, options?: IFindByIdBaseOptions): Promise<T> {
    const created = new this.model(data);
    await created.save();
    return this.findByIdBase(created._id.toString(), options);
  }

  async updateOneBase(id: string, data: UpdateQuery<T>, options?: IFindByIdBaseOptions): Promise<T> {
    await this.model.updateOne({ _id: id }, data).exec();
    return this.findByIdBase(id, options);
  }

  async deleteOneBase(id: string): Promise<SuccessResponse> {
    await this.model.deleteOne({ _id: id }).exec();
    return new SuccessResponse(`${this.model.modelName} deleted successfully`, null);
  }

  async softDeleteOneBase(id: string): Promise<SuccessResponse> {
    await this.model.updateOne({ _id: id }, { isDeleted: true }).exec();
    return new SuccessResponse(`${this.model.modelName} soft deleted successfully`, null);
  }

  async recoverByIdBase(id: string, options?: IFindByIdBaseOptions): Promise<T> {
    await this.model.updateOne({ _id: id }, { isDeleted: false }).exec();
    return this.findByIdBase(id, options);
  }
}
