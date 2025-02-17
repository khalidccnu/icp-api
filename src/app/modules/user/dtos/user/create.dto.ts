import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'XYZ',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly name!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '1715123456',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  readonly phone!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'abc@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  readonly email!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password!: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'true',
  })
  @IsBooleanString()
  @IsOptional()
  isActive?: boolean;
}
