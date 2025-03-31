import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.datPhong.findMany();
  }

  async getById(id: number) {
    const booking = await this.prisma.datPhong.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking không tồn tại');
    return booking;
  }

  async create(dto: CreateBookingDto) {
    return this.prisma.datPhong.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateBookingDto) {
    await this.getById(id);
    return this.prisma.datPhong.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.getById(id);
    return this.prisma.datPhong.delete({ where: { id } });
  }

  async getByUser(maNguoiDung: number) {
    return this.prisma.datPhong.findMany({
      where: { ma_nguoi_dat: maNguoiDung },
    });
  }
}
