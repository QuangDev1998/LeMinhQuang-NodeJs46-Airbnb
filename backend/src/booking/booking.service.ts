import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(dto: CreateBookingDto) {
    const booking = await this.prisma.datPhong.create({
      data: {
        ma_phong: dto.ma_phong,
        ngay_den: new Date(dto.ngay_den),
        ngay_di: new Date(dto.ngay_di),
        so_luong_khach: dto.so_luong_khach,
        ma_nguoi_dat: dto.ma_nguoi_dat,
      },
    });

    return this.response(booking, 201);
  }

  async update(id: number, dto: UpdateBookingDto) {
    await this.getById(id);
    const updated = await this.prisma.datPhong.update({
      where: { id },
      data: dto,
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
