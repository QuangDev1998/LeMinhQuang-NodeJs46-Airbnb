import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: 'Mã phòng cần bình luận',
  })
  @IsInt()
  ma_phong: number;

  @ApiProperty({
    example: 1001,
    description: 'Mã người dùng thực hiện bình luận',
  })
  @IsInt()
  ma_nguoi_binh_luan: number;

  @ApiProperty({
    example: 'Phòng sạch sẽ, nhân viên thân thiện',
    description: 'Nội dung chi tiết của bình luận',
  })
  @IsString()
  @IsNotEmpty()
  noi_dung: string;

  @ApiProperty({
    example: 5,
    description: 'Số sao đánh giá từ 1 đến 5',
  })
  @IsInt()
  sao_binh_luan: number;

  @ApiProperty({
    example: '2025-04-08T10:30:00.000Z',
    description: 'Ngày bình luận (ISO format)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  ngay_binh_luan?: string;
}

export class UpdateCommentDto {
  @ApiProperty({
    example: 123,
    description: 'ID của bình luận cần cập nhật (hiển thị cho Swagger)',
  })
  @IsInt()
  id: number;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Mã công việc (mã phòng)',
  })
  @IsOptional()
  @IsInt()
  ma_cong_viec?: number;

  @ApiProperty({
    example: 1001,
    required: false,
    description: 'Mã người bình luận',
  })
  @IsOptional()
  @IsInt()
  ma_nguoi_binh_luan?: number;

  @ApiProperty({
    example: '2025-04-08T10:30:00.000Z',
    required: false,
    description: 'Ngày bình luận (ISO format)',
  })
  @IsOptional()
  @IsDateString()
  ngay_binh_luan?: string;

  @ApiProperty({
    example: 'Phòng sạch sẽ, nhân viên thân thiện',
    required: false,
    description: 'Nội dung bình luận',
  })
  @IsOptional()
  @IsString()
  noi_dung?: string;

  @ApiProperty({
    example: 5,
    required: false,
    description: 'Số sao đánh giá (1-5)',
  })
  @IsOptional()
  @IsInt()
  sao_binh_luan?: number;
}
