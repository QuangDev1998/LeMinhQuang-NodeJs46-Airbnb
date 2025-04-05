import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const rooms = await this.prisma.phong.findMany();
    return rooms.map((room) => this.mapRoom(room));
  }

  async getById(id: number) {
    const room = await this.prisma.phong.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Phòng không tồn tại');
    return this.mapRoom(room);
  }

  create(dto: CreateRoomDto) {
    return this.prisma.phong.create({ data: dto });
  }

  async update(id: number, dto: UpdateRoomDto) {
    await this.getById(id);
    return this.prisma.phong.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.getById(id);

    await this.prisma.datPhong.deleteMany({ where: { ma_phong: id } });
    await this.prisma.binhLuan.deleteMany({ where: { ma_cong_viec: id } });

    await this.prisma.phong.delete({ where: { id } });

    return { message: `Xóa phòng có id = ${id} thành công` };
  }

  async paginate(pageIndex: number, pageSize: number, keyword?: string) {
    const skip = (pageIndex - 1) * pageSize;
    const where = keyword
      ? {
          ten_phong: {
            contains: keyword,
            mode: 'insensitive',
          },
        }
      : {};

    const [rooms, total] = await Promise.all([
      this.prisma.phong.findMany({ where, skip, take: pageSize }),
      this.prisma.phong.count({ where }),
    ]);

    return {
      statusCode: 200,
      content: rooms.map((r) => this.mapRoom(r)),
      totalRow: total,
      pageIndex,
      pageSize,
      dateTime: new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
      }),
    };
  }

  async getByLocation(viTriId: number) {
    const rooms = await this.prisma.phong.findMany({
      where: { vi_tri_id: viTriId },
    });

    return rooms.map((room) => this.mapRoom(room));
  }

  async uploadImage(id: number, filePath: string) {
    await this.getById(id);
    return this.prisma.phong.update({
      where: { id },
      data: { hinh_anh: filePath },
    });
  }

  private mapRoom(room: any) {
    return {
      id: room.id,
      tenPhong: room.ten_phong,
      hinhAnh: room.hinh_anh,
      giaTien: room.gia_tien,
      khach: room.khach,
      phongNgu: room.phong_ngu,
      giuong: room.giuong,
      phongTam: room.phong_tam,
      moTa: room.mo_ta,
      wifi: room.wifi,
      mayGiat: room.may_giat,
      hoBoi: room.ho_boi,
      viTriId: room.vi_tri_id,
    };
  }
}
