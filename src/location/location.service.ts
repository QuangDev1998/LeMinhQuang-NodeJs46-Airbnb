import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.viTri.findMany();
  }

  async getById(id: number) {
    const location = await this.prisma.viTri.findUnique({
      where: { id },
    });
    if (!location) throw new NotFoundException('ID không hợp lệ');
    return location;
  }

  async create(dto: CreateLocationDto) {
    return this.prisma.viTri.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateLocationDto) {
    await this.getById(id);
    return this.prisma.viTri.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.getById(id);
    return this.prisma.viTri.delete({ where: { id } });
  }

  async paginate(pageIndex = 1, pageSize = 10, keyword = '') {
    const skip = (Number(pageIndex) - 1) * Number(pageSize);

    const [data, totalRow] = await Promise.all([
      this.prisma.viTri.findMany({
        skip,
        take: Number(pageSize),
        where: keyword
          ? {
              ten_vi_tri: {
                contains: keyword,
              },
            }
          : undefined,
      }),
      this.prisma.viTri.count({
        where: keyword
          ? {
              ten_vi_tri: {
                contains: keyword,
              },
            }
          : undefined,
      }),
    ]);

    return {
      statusCode: 200,
      content: {
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        totalRow,
        keywords: keyword ? `TenViTri LIKE N'%${keyword}%'` : null,
        data,
      },
      dateTime: new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
      }),
    };
  }

  async uploadImage(id: number, filePath: string) {
    // Kiểm tra vị trí có tồn tại
    const viTri = await this.getById(id);

    // Cập nhật hình ảnh vào DB
    const updatedViTri = await this.prisma.viTri.update({
      where: { id },
      data: { hinh_anh: filePath },
    });

    // Trả về kết quả
    return {
      message: 'Upload hình thành công',
      data: updatedViTri,
    };
  }
}
