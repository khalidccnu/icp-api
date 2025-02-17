import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { BloodGroupType } from '../../enums/userInfo.enum';

export class UpdateUserInfoDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: '1990-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  readonly birthday?: Date;

  @ApiProperty({
    enum: BloodGroupType,
    required: false,
    example: 'B+',
  })
  @IsOptional()
  @IsEnum(BloodGroupType)
  readonly bloodGroup?: BloodGroupType;
}
