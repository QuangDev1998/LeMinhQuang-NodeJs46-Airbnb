import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ToggleFavoriteDto {
  @ApiProperty({ example: 1, description: 'ID phòng cần bật/tắt yêu thích' })
  @IsNotEmpty()
  @IsInt()
  maPhong: number;
}
