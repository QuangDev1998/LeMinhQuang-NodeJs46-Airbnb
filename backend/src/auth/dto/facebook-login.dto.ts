import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FacebookLoginDto {
  @ApiProperty({ description: 'Access token lấy được từ Facebook SDK' })
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
