import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { BloodGroupType } from '../../enums/userInfo.enum';

export class CreateUserInfoDTO {
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
    example: BloodGroupType['B+'],
  })
  @IsOptional()
  @IsEnum(BloodGroupType)
  readonly bloodGroup?: BloodGroupType;

  @ApiProperty({
    type: String,
    required: true,
    description: 'User id',
    example: 'aff56afb-b015-4dbe-802f-a03be230f7ba',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly user!: any;
}
