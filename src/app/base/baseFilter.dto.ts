import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBooleanString, IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { BaseSortOrder } from './base.enum';

export class BaseFilterDTO {
  @ApiProperty({
    type: Number,
    required: false,
    default: 1,
  })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => +value)
  page?: number = 1;

  @ApiProperty({
    type: Number,
    required: false,
    default: 10,
  })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => +value)
  limit?: number = 10;

  @ApiProperty({
    type: String,
    required: false,
    description: 'icp',
  })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'true',
  })
  @IsBooleanString()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    type: String,
    required: false,
    description: '1990-01-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    type: String,
    required: false,
    description: '1990-01-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    type: String,
    required: false,
    description: 'createdAt',
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    enum: BaseSortOrder,
    required: false,
    description: BaseSortOrder.ASC,
  })
  @IsEnum(BaseSortOrder)
  @IsOptional()
  sortOrder?: BaseSortOrder;
}
