import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: '1715123456',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  readonly phone?: string;

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
}
