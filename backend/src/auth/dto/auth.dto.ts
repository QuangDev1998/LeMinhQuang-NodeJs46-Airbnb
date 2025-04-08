import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'string', description: 'Tên người dùng' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'string',
    description: 'Email đăng ký',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'string', description: 'Mật khẩu người dùng' })
  @IsNotEmpty()
  @IsString()
  pass_word: string;

  @ApiProperty({
    example: 'number',
    description: 'Số điện thoại',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: '0000-00-00',
    description: 'Ngày sinh định dạng YYYY-MM-DD',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birth_day?: string;

  @ApiProperty({
    example: 'true',
    description: 'Giới tính: true (Nam), false (Nữ)',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender: 'true' | 'false';

  @ApiProperty({
    example: 'USER',
    description: 'Vai trò người dùng (USER / ADMIN)',
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: string;
}

export class SigninDto {
  @ApiProperty({ example: 'string' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  pass_word: string;
}
