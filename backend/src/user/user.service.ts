import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { format } from 'date-fns-tz';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private getDateTime() {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  }

  private response(content: any, statusCode = 200, extra = {}) {
    return { statusCode, content, dateTime: this.getDateTime(), ...extra };
  }

  // Loại bỏ pass_word trước khi trả ra ngoài
  private excludePassword<T extends { pass_word?: string }>(user: T) {
    if (!user) return user;
    const { pass_word, ...rest } = user;
    return rest;
  }

  async getAll() {
    const data = await this.prisma.nguoiDung.findMany();
    return this.response(data.map((u) => this.excludePassword(u)));
  }

  async getById(id: number) {
    const user = await this.prisma.nguoiDung.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('ID không hợp lệ');
    return this.response(this.excludePassword(user));
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
      data: data.map((u) => this.excludePassword(u)),
    });
  }

  async create(dto: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.nguoiDung.create({
        data: {
          name: dto.name,
          email: dto.email,
          pass_word: hash,
          phone: dto.phone ?? '',
          birth_day: dto.birthday ? new Date(dto.birthday) : null,
          gender: dto.gender || false,
          role: dto.role ?? 'USER',
        },
      });

      return this.response(this.excludePassword(user), 201);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email đã tồn tại');
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    // Chỉ cập nhật các field thực sự được gửi lên (tránh ghi đè null/USER ngoài ý muốn)
    const data: Record<string, any> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.birthday !== undefined)
      data.birth_day = dto.birthday ? new Date(dto.birthday) : null;
    if (dto.gender !== undefined) data.gender = dto.gender;
    if (dto.role !== undefined) data.role = dto.role;

    const user = await this.prisma.nguoiDung.update({
      where: { id },
      data,
    });
    return this.response(this.excludePassword(user));
  }

  async delete(id: number) {
    try {
      await this.prisma.nguoiDung.delete({
        where: { id },
      });

      return this.response('Xóa người dùng thành công');
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Người dùng không tồn tại');
      }
      throw error;
    }
  }

  // ✅ Hàm mới: upload ảnh lên Cloudinary
  async uploadAvatar(userId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file ảnh để upload');
    }

    // Config Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'avatars', format: 'png' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });

    // Cập nhật DB
    await this.prisma.nguoiDung.update({
      where: { id: userId },
      data: { avatar: uploadResult.secure_url },
    });

    return this.response({
      message: 'Upload avatar thành công',
      avatar: uploadResult.secure_url,
    });
  }
}
