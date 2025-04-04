import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.phong.findMany();
  }

  async getById(id: number) {
    const room = await this.prisma.phong.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Phòng không tồn tại');
    return room;
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
      data: rooms,
      totalRow: total,
      pageIndex,
      pageSize,
    };
  }

  getByLocation(viTriId: number) {
    return this.prisma.phong.findMany({ where: { vi_tri_id: viTriId } });
  }

  async uploadImage(id: number, filePath: string) {
    await this.getById(id);
    return this.prisma.phong.update({
      where: { id },
      data: { hinh_anh: filePath },
    });
  }
}
