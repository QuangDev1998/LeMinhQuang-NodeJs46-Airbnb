import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'email@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;

  @ApiProperty({ example: '0987654321' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: '1995-01-01' })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  gender?: boolean;

  @ApiPropertyOptional({ example: 'USER' })
  @IsOptional()
  @IsString()
  role?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn B' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'newmail@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '0912345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1995-01-01' })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  gender?: boolean;

  @ApiPropertyOptional({ example: 'ADMIN' })
  @IsOptional()
  @IsString()
  role?: string;
}
