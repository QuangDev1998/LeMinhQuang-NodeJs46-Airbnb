// import vào đầu file
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 0, description: 'Mã phòng cần đặt' })
  ma_phong: number;

  @ApiProperty({
    example: '2025-04-08T03:20:05.800Z',
    description: 'Ngày đến (ISO format)',
  })
  ngay_den: Date;

  @ApiProperty({
    example: '2025-04-10T03:20:05.800Z',
    description: 'Ngày đi (ISO format)',
  })
  ngay_di: Date;

  @ApiProperty({ example: 0, description: 'Số lượng khách' })
  so_luong_khach: number;

  @ApiProperty({ example: 0, description: 'Mã người dùng đặt' })
  ma_nguoi_dat: number;
}

export class UpdateBookingDto {
  @ApiProperty({ example: 0, required: false })
  ma_phong?: number;

  @ApiProperty({ example: '2025-04-08T03:20:05.800Z', required: false })
  ngay_den?: Date;

  @ApiProperty({ example: '2025-04-10T03:20:05.800Z', required: false })
  ngay_di?: Date;

  @ApiProperty({ example: 0, required: false })
  so_luong_khach?: number;

  @ApiProperty({ example: 0, required: false })
  ma_nguoi_dat?: number;
}
