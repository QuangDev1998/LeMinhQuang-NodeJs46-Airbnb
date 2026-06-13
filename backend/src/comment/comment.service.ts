import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { format } from 'date-fns-tz';

type CurrentUser = { id: number; role: string };

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

  async create(dto: CreateCommentDto, userId: number) {
    const newComment = await this.prisma.binhLuan.create({
      data: {
        ...dto,
        // BẢO MẬT: người bình luận = user đăng nhập, KHÔNG tin field từ body
        ma_nguoi_binh_luan: userId,
        ngay_binh_luan: dto.ngay_binh_luan
          ? new Date(dto.ngay_binh_luan)
          : new Date(),
      },
    });
    return this.response(newComment, 201);
  }

  async update(id: number, dto: UpdateCommentDto, user: CurrentUser) {
    const comment = await this.findById(id);
    this.assertOwnerOrAdmin(comment.ma_nguoi_binh_luan, user);
    const updated = await this.prisma.binhLuan.update({
      where: { id },
      data: {
        ...dto,
        // không cho đổi chủ bình luận khi cập nhật
        ma_nguoi_binh_luan: comment.ma_nguoi_binh_luan,
        ngay_binh_luan: dto.ngay_binh_luan
          ? new Date(dto.ngay_binh_luan)
          : undefined,
      },
    });
    return this.response(updated);
  }

  async remove(id: number, user: CurrentUser) {
    const comment = await this.findById(id);
    this.assertOwnerOrAdmin(comment.ma_nguoi_binh_luan, user);
    const deleted = await this.prisma.binhLuan.delete({ where: { id } });
    return this.response(deleted);
  }

  // BẢO MẬT: chỉ chủ bình luận hoặc admin mới được sửa/xoá
  private assertOwnerOrAdmin(ownerId: number, user: CurrentUser) {
    if (user.role !== 'ADMIN' && user.id !== ownerId) {
      throw new ForbiddenException('Bạn không có quyền với bình luận này');
    }
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
