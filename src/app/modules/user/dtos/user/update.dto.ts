import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserInfoDTO } from '@src/app/modules/userInfo/dtos';
import { IsBooleanString, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDTO extends UpdateUserInfoDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'XYZ',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly name?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '1715123456',
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  readonly phone?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'abc@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'true',
  })
  @IsBooleanString()
  @IsOptional()
  isActive?: boolean;
}
