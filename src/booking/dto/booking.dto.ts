export class CreateBookingDto {
  ma_phong: number;
  ngay_den: Date;
  ngay_di: Date;
  so_luong_khach: number;
  ma_nguoi_dat: number;
}

export class UpdateBookingDto {
  ma_phong?: number;
  ngay_den?: Date;
  ngay_di?: Date;
  so_luong_khach?: number;
  ma_nguoi_dat?: number;
}
