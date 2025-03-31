import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  ten_phong: string;

  @IsInt()
  khach: number;

  @IsInt()
  phong_ngu: number;

  @IsInt()
  giuong: number;

  @IsInt()
  phong_tam: number;

  @IsString()
  @IsNotEmpty()
  mo_ta: string;

  @IsInt()
  gia_tien: number;

  @IsBoolean()
  may_giat: boolean;

  @IsBoolean()
  ban_la: boolean;

  @IsBoolean()
  tivi: boolean;

  @IsBoolean()
  dieu_hoa: boolean;

  @IsBoolean()
  wifi: boolean;

  @IsBoolean()
  bep: boolean;

  @IsBoolean()
  do_xe: boolean;

  @IsBoolean()
  ho_boi: boolean;

  @IsBoolean()
  ban_ui: boolean;

  @IsString()
  hinh_anh: string;

  @IsInt()
  vi_tri_id: number;
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  ten_phong?: string;

  @IsOptional()
  @IsInt()
  khach?: number;

  @IsOptional()
  @IsInt()
  phong_ngu?: number;

  @IsOptional()
  @IsInt()
  giuong?: number;

  @IsOptional()
  @IsInt()
  phong_tam?: number;

  @IsOptional()
  @IsString()
  mo_ta?: string;

  @IsOptional()
  @IsInt()
  gia_tien?: number;

  @IsOptional()
  @IsBoolean()
  may_giat?: boolean;

  @IsOptional()
  @IsBoolean()
  ban_la?: boolean;

  @IsOptional()
  @IsBoolean()
  tivi?: boolean;

  @IsOptional()
  @IsBoolean()
  dieu_hoa?: boolean;

  @IsOptional()
  @IsBoolean()
  wifi?: boolean;

  @IsOptional()
  @IsBoolean()
  bep?: boolean;

  @IsOptional()
  @IsBoolean()
  do_xe?: boolean;

  @IsOptional()
  @IsBoolean()
  ho_boi?: boolean;

  @IsOptional()
  @IsBoolean()
  ban_ui?: boolean;

  @IsOptional()
  @IsString()
  hinh_anh?: string;
}
