import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDTO } from '@src/app/base';
import { IsEnum, IsOptional } from 'class-validator';
import { BloodGroupType } from '../../enums/userInfo.enum';

export class FilterUserInfoDTO extends BaseFilterDTO {
  @ApiProperty({
    enum: BloodGroupType,
    required: false,
  })
  @IsOptional()
  @IsEnum(BloodGroupType)
  readonly bloodGroup?: BloodGroupType;
}
