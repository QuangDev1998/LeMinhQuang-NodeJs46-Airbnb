import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.binhLuan.findMany();
  }

  async create(dto: CreateCommentDto) {
    return this.prisma.binhLuan.create({
      data: {
        ...dto,
        ngay_binh_luan: new Date(), // ✅ thêm ngày comment
      },
    });
  }

  async update(id: number, dto: UpdateCommentDto) {
    await this.findById(id);
    return this.prisma.binhLuan.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findById(id);
    return this.prisma.binhLuan.delete({ where: { id } });
  }

  async getByRoom(maPhong: number) {
    return this.prisma.binhLuan.findMany({
      where: { ma_cong_viec: maPhong },
    });
  }

  async findById(id: number) {
    const comment = await this.prisma.binhLuan.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Bình luận không tồn tại');
    return comment;
  }
}
