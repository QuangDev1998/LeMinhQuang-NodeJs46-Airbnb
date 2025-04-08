import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { format } from 'date-fns-tz';

@Injectable()
export class CommentService {
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
    const data = await this.prisma.binhLuan.findMany();
    return this.response(data);
  }

  async create(dto: CreateCommentDto) {
    const newComment = await this.prisma.binhLuan.create({
      data: {
        ...dto,
        ngay_binh_luan: dto.ngay_binh_luan
          ? new Date(dto.ngay_binh_luan)
          : new Date(),
      },
    });
    return this.response(newComment, 201);
  }

  async update(id: number, dto: UpdateCommentDto) {
    await this.findById(id);
    const updated = await this.prisma.binhLuan.update({
      where: { id },
      data: {
        ...dto,
        ngay_binh_luan: dto.ngay_binh_luan
          ? new Date(dto.ngay_binh_luan)
          : undefined,
      },
    });
    return this.response(updated);
  }

  async remove(id: number) {
    await this.findById(id);
    const deleted = await this.prisma.binhLuan.delete({ where: { id } });
    return this.response(deleted);
  }

  async getByRoom(maPhong: number) {
    const data = await this.prisma.binhLuan.findMany({
      where: { ma_phong: maPhong },
      include: {
        NguoiDung: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Map lại dữ liệu trước khi trả về
    const mapped = data.map((c) => ({
      id: c.id,
      maPhong: c.ma_phong,
      maNguoiBinhLuan: c.ma_nguoi_binh_luan,
      tenNguoiBinhLuan: c.NguoiDung?.name || 'Ẩn danh',
      avatar:
        c.NguoiDung?.avatar ||
        'https://cdn-icons-png.flaticon.com/512/6596/6596121.png',
      noiDung: c.noi_dung,
      saoBinhLuan: c.sao_binh_luan,
      ngayBinhLuan: c.ngay_binh_luan,
    }));

    return this.response(mapped);
  }

  async findById(id: number) {
    const comment = await this.prisma.binhLuan.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Bình luận không tồn tại');
    return comment;
  }
}
