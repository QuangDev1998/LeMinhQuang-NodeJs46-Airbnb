import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { format } from 'date-fns-tz';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateTime() {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  }

  private response(content: any, statusCode = 200, extra = {}) {
    return { statusCode, content, dateTime: this.getDateTime(), ...extra };
  }

  async getAll() {
    const data = await this.prisma.nguoiDung.findMany();
    return this.response(data);
  }

  async getById(id: number) {
    const user = await this.prisma.nguoiDung.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('ID không hợp lệ');
    return this.response(user);
  }

  async search(name: string) {
    const data = await this.prisma.nguoiDung.findMany({
      where: { name: { contains: name } },
    });
    return this.response(data);
  }

  async getPaging(pageIndex = 1, pageSize = 10, keyword = '') {
    const page = Number(pageIndex);
    const size = Number(pageSize);
    const condition = keyword ? { name: { contains: keyword } } : undefined;

    const [data, totalRow] = await Promise.all([
      this.prisma.nguoiDung.findMany({
        skip: (page - 1) * size,
        take: size,
        where: condition,
      }),
      this.prisma.nguoiDung.count({ where: condition }),
    ]);

    return this.response({
      pageIndex: page,
      pageSize: size,
      totalRow,
      keywords: keyword ? `Name LIKE N'%${keyword}%'` : null,
      data,
    });
  }

  async create(dto: CreateUserDto) {
    const user = await this.prisma.nguoiDung.create({
      data: {
        name: dto.name,
        email: dto.email,
        pass_word: dto.password,
        phone: dto.phone ?? '',
        birth_day: dto.birthday ?? '',
        gender: dto.gender ? 'male' : 'female',
        role: dto.role ?? 'USER',
      },
    });
    return this.response(user, 201);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.nguoiDung.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone ?? '',
        birth_day: dto.birthday ?? '',
        gender: dto.gender ? 'male' : 'female',
        role: dto.role ?? 'USER',
      },
    });
    return this.response(user);
  }

  async delete(id: number) {
    await this.prisma.nguoiDung.delete({ where: { id } });
    return this.response('Xóa người dùng thành công');
  }

  async uploadAvatar(userId: number, filePath: string) {
    await this.prisma.nguoiDung.update({
      where: { id: userId },
      data: { avatar: filePath },
    });
    return this.response({
      message: 'Upload avatar thành công',
      avatar: filePath,
    });
  }
}
