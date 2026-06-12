// import vào đầu file
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 0, description: 'Mã phòng cần đặt' })
  @IsInt()
  ma_phong: number;

  @ApiProperty({
    example: '2025-04-08T03:20:05.800Z',
    description: 'Ngày đến (ISO format)',
  })
  @IsDateString()
  ngay_den: string;

  @ApiProperty({
    example: '2025-04-10T03:20:05.800Z',
    description: 'Ngày đi (ISO format)',
  })
  @IsDateString()
  ngay_di: string;

  @ApiProperty({ example: 1, description: 'Số lượng khách' })
  @IsInt()
  @Min(1)
  so_luong_khach: number;

  @ApiProperty({ example: 0, description: 'Mã người dùng đặt' })
  @IsInt()
  ma_nguoi_dat: number;
}

export class UpdateBookingDto {
  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  ma_phong?: number;

  @ApiProperty({ example: '2025-04-08T03:20:05.800Z', required: false })
  @IsOptional()
  @IsDateString()
  ngay_den?: string;

  @ApiProperty({ example: '2025-04-10T03:20:05.800Z', required: false })
  @IsOptional()
  @IsDateString()
  ngay_di?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  so_luong_khach?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  ma_nguoi_dat?: number;
}
