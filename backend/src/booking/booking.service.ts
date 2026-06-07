import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { format } from 'date-fns-tz';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  private getDateTime() {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  }

  private response(content: any, statusCode = 200) {
    return {
      statusCode,
      content,
      dateTime: this.getDateTime(),
    };
  }

  async getAll() {
    const data = await this.prisma.datPhong.findMany();
    return this.response(data);
  }

  async getById(id: number) {
    const booking = await this.prisma.datPhong.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking không tồn tại');
    return this.response(booking);
  }

  // Kiểm tra ngày hợp lệ, sức chứa phòng và trùng lịch đặt
  private async validateBooking(
    maPhong: number,
    ngayDen: Date,
    ngayDi: Date,
    soLuongKhach: number,
    ignoreBookingId?: number,
  ) {
    if (isNaN(ngayDen.getTime()) || isNaN(ngayDi.getTime())) {
      throw new BadRequestException('Ngày đến/đi không hợp lệ');
    }
    if (ngayDen >= ngayDi) {
      throw new BadRequestException('Ngày đến phải trước ngày đi');
    }

    const room = await this.prisma.phong.findUnique({
      where: { id: maPhong },
    });
    if (!room) throw new NotFoundException('Phòng không tồn tại');

    if (soLuongKhach != null && soLuongKhach > room.khach) {
      throw new BadRequestException(
        `Phòng chỉ chứa tối đa ${room.khach} khách`,
      );
    }

    // Trùng lịch khi: ngay_den hiện có < ngay_di mới  VÀ  ngay_di hiện có > ngay_den mới
    const conflict = await this.prisma.datPhong.findFirst({
      where: {
        ma_phong: maPhong,
        ngay_den: { lt: ngayDi },
        ngay_di: { gt: ngayDen },
        ...(ignoreBookingId ? { id: { not: ignoreBookingId } } : {}),
      },
    });
    if (conflict) {
      throw new BadRequestException(
        'Phòng đã được đặt trong khoảng thời gian này',
      );
    }
  }

  async create(dto: CreateBookingDto) {
    const ngayDen = new Date(dto.ngay_den);
    const ngayDi = new Date(dto.ngay_di);
    await this.validateBooking(
      dto.ma_phong,
      ngayDen,
      ngayDi,
      dto.so_luong_khach,
    );

    const booking = await this.prisma.datPhong.create({
      data: {
        ma_phong: dto.ma_phong,
        ngay_den: ngayDen,
        ngay_di: ngayDi,
        so_luong_khach: dto.so_luong_khach,
        ma_nguoi_dat: dto.ma_nguoi_dat,
      },
    });

    return this.response(booking, 201);
  }

  async update(id: number, dto: UpdateBookingDto) {
    const current = await this.prisma.datPhong.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Booking không tồn tại');

    // Lấy giá trị mới nếu có, ngược lại giữ giá trị cũ
    const maPhong = dto.ma_phong ?? current.ma_phong;
    const ngayDen = dto.ngay_den ? new Date(dto.ngay_den) : current.ngay_den;
    const ngayDi = dto.ngay_di ? new Date(dto.ngay_di) : current.ngay_di;
    const soLuongKhach = dto.so_luong_khach ?? current.so_luong_khach;

    await this.validateBooking(maPhong, ngayDen, ngayDi, soLuongKhach, id);

    const updated = await this.prisma.datPhong.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.ngay_den ? { ngay_den: ngayDen } : {}),
        ...(dto.ngay_di ? { ngay_di: ngayDi } : {}),
      },
    });
    return this.response(updated);
  }

  async remove(id: number) {
    await this.getById(id);
    const deleted = await this.prisma.datPhong.delete({ where: { id } });
    return this.response(deleted);
  }

  async getByUser(maNguoiDung: number) {
    const data = await this.prisma.datPhong.findMany({
      where: { ma_nguoi_dat: maNguoiDung },
    });
    return this.response(data);
  }
}
