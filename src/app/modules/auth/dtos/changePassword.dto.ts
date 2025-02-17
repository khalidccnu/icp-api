import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly currentPassword!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly newPassword!: string;
}
