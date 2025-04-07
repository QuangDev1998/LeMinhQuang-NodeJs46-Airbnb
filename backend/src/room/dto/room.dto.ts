import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  ten_phong: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  khach: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  phong_ngu: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  giuong: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  phong_tam: number;

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  mo_ta: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  gia_tien: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  may_giat: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  ban_la: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  tivi: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  dieu_hoa: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  wifi: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  bep: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  do_xe: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  ho_boi: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  ban_ui: boolean;

  @ApiProperty({ example: 'https://picsum.photos/200/300' })
  @IsString()
  hinh_anh: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  vi_tri_id: number;
}

export class UpdateRoomDto {
  @ApiProperty({ example: 'string', required: false })
  @IsOptional()
  @IsString()
  ten_phong?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  khach?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  phong_ngu?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  giuong?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  phong_tam?: number;

  @ApiProperty({ example: 'string', required: false })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  gia_tien?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  may_giat?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  ban_la?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  tivi?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  dieu_hoa?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  wifi?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  bep?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  do_xe?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  ho_boi?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  ban_ui?: boolean;

  @ApiProperty({ example: 'https://picsum.photos/200', required: false })
  @IsOptional()
  @IsString()
  hinh_anh?: string;
}
