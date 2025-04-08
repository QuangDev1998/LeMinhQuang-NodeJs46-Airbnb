import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { v2 as cloudinary } from 'cloudinary';
import { format } from 'date-fns-tz';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  private getDateTime() {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  }

  private response(content: any, statusCode = 200, extra = {}) {
    return { statusCode, content, dateTime: this.getDateTime(), ...extra };
  }

  async getAll() {
    const rooms = await this.prisma.phong.findMany();
    return rooms.map((room) => this.mapRoom(room));
  }

  async getById(id: number) {
    const room = await this.prisma.phong.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Phòng không tồn tại');
    return this.mapRoom(room);
  }

  async create(dto: CreateRoomDto) {
    const newRoom = await this.prisma.phong.create({ data: dto });
    return this.mapRoom(newRoom);
  }

  async update(id: number, dto: UpdateRoomDto) {
    await this.getById(id);
    const updated = await this.prisma.phong.update({
      where: { id },
      data: dto,
    });
    return this.mapRoom(updated);
  }

  async remove(id: number) {
    await this.getById(id);
    await this.prisma.datPhong.deleteMany({ where: { ma_phong: id } });
    await this.prisma.phong.delete({ where: { id } });
    return `Xóa phòng ID = ${id} thành công`;
  }

  async paginate(pageIndex: number, pageSize: number, keyword?: string) {
    const skip = (pageIndex - 1) * pageSize;
    const where = keyword
      ? { ten_phong: { contains: keyword, mode: 'insensitive' } }
      : {};

    const [rooms, total] = await Promise.all([
      this.prisma.phong.findMany({ where, skip, take: pageSize }),
      this.prisma.phong.count({ where }),
    ]);

    return {
      pageIndex,
      pageSize,
      totalRow: total,
      keyword,
      data: rooms.map((r) => this.mapRoom(r)),
    };
  }

  async getByLocation(viTriId: number) {
    const rooms = await this.prisma.phong.findMany({
      where: { vi_tri_id: viTriId },
    });
    return rooms.map((room) => this.mapRoom(room));
  }

  async uploadImageCloud(id: number, file: Express.Multer.File) {
    const room = await this.prisma.phong.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Phòng không tồn tại');

    if (!file || !file.buffer || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Vui lòng chọn file hình hợp lệ');
    }

    // Cloudinary config
    cloudinary.config({
      cloud_name: 'leminhquang',
      api_key: '895984712795561',
      api_secret: 'teoCAmfCSjswWNTjpy1GYxO6OU4',
    });

    // Upload image
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'airbnb_rooms' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      stream.end(file.buffer);
    });

    // Update room image
    const updatedRoom = await this.prisma.phong.update({
      where: { id },
      data: {
        hinh_anh: uploadResult.secure_url,
      },
    });

    return {
      id: updatedRoom.id,
      tenPhong: updatedRoom.ten_phong,
      hinhAnh: uploadResult.secure_url,
    };
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
