import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  pass_word: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  birth_day?: string;

  @IsOptional()
  @IsString()
  gender: 'true' | 'false';

  @IsOptional()
  @IsString()
  role?: string;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  pass_word: string;
}
