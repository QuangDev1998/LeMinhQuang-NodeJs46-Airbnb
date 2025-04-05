// src/location/dto/location.dto.ts

export class CreateLocationDto {
  ten_vi_tri: string;
  tinh_thanh: string;
  quoc_gia: string;
  hinh_anh: string;
}

export class UpdateLocationDto {
  ten_vi_tri?: string;
  tinh_thanh?: string;
  quoc_gia?: string;
  hinh_anh?: string;
}
