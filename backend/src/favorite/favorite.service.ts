import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { format } from 'date-fns-tz';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  private getDateTime() {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  }

  private response(content: any, statusCode = 200) {
    return { statusCode, content, dateTime: this.getDateTime() };
  }

  private mapRoom(room: any) {
    return {
      id: room.id,
      tenPhong: room.ten_phong,
      hinhAnh: room.hinh_anh,
      danhSachAnh: this.parseGallery(room.danh_sach_anh, room.hinh_anh),
      loaiPhong: room.loai_phong,
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

  private parseGallery(raw: any, fallback: string) {
    if (!raw) return fallback ? [fallback] : [];
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) && arr.length ? arr : fallback ? [fallback] : [];
    } catch {
      return fallback ? [fallback] : [];
    }
  }

  // Bật/tắt yêu thích 1 phòng cho user hiện tại
  async toggle(userId: number, maPhong: number) {
    const room = await this.prisma.phong.findUnique({ where: { id: maPhong } });
    if (!room) throw new NotFoundException('Phòng không tồn tại');

    const existing = await this.prisma.yeuThich.findUnique({
      where: {
        ma_nguoi_dung_ma_phong: { ma_nguoi_dung: userId, ma_phong: maPhong },
      },
    });

    if (existing) {
      await this.prisma.yeuThich.delete({ where: { id: existing.id } });
      return this.response({ maPhong, favorited: false });
    }

    await this.prisma.yeuThich.create({
      data: { ma_nguoi_dung: userId, ma_phong: maPhong },
    });
    return this.response({ maPhong, favorited: true });
  }

  // Danh sách phòng đã yêu thích (đầy đủ thông tin phòng)
  async getMyFavorites(userId: number) {
    const favs = await this.prisma.yeuThich.findMany({
      where: { ma_nguoi_dung: userId },
      orderBy: { ngay_tao: 'desc' },
      include: { Phong: true },
    });
    return this.response(favs.map((f) => this.mapRoom(f.Phong)));
  }

  // Danh sách id phòng đã yêu thích (để đánh dấu trái tim ở FE)
  async getMyFavoriteIds(userId: number) {
    const favs = await this.prisma.yeuThich.findMany({
      where: { ma_nguoi_dung: userId },
      select: { ma_phong: true },
    });
    return this.response(favs.map((f) => f.ma_phong));
  }
}
