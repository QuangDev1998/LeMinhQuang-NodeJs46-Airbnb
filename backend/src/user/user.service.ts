import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { format } from 'date-fns-tz';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
      keywords: keyword ? `name LIKE '%${keyword}%'` : null,
      data,
    });
  }

  async create(dto: CreateUserDto) {
    try {
      const user = await this.prisma.nguoiDung.create({
        data: {
          name: dto.name,
          email: dto.email,
          pass_word: dto.password,
          phone: dto.phone ?? '',
          birth_day: dto.birthday ? new Date(dto.birthday) : null,
          gender: dto.gender || false,
          role: dto.role ?? 'USER',
        },
      });

      return this.response(user, 201);
    } catch (error) {
      // Bắt lỗi trùng unique email
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'Email đã tồn tại, vui lòng dùng email khác',
        );
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.nguoiDung.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone ?? '',
        birth_day: dto.birthday ? new Date(dto.birthday) : null,
        gender: dto.gender,
        role: dto.role ?? 'USER',
      },
    });
    return this.response(user);
  }
  async delete(id: number) {
    try {
      await this.prisma.nguoiDung.delete({
        where: { id },
      });

      return this.response('Xóa người dùng thành công');
    } catch (error) {
      // Bắt lỗi khi ID không tồn tại
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Người dùng không tồn tại');
      }
      throw error;
    }
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
