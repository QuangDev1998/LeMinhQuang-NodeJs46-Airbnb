import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  ma_cong_viec: number;

  @IsInt()
  ma_nguoi_binh_luan: number;

  @IsString()
  @IsNotEmpty()
  noi_dung: string;

  @IsInt()
  sao_binh_luan: number;
}

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  noi_dung?: string;

  @IsOptional()
  @IsInt()
  sao_binh_luan?: number;
}
