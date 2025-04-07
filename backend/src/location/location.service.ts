import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/location.dto';
import { format } from 'date-fns-tz';

@Injectable()
export class LocationService {
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
    const data = await this.prisma.viTri.findMany();
    return this.response(data);
  }

  async getById(id: number) {
    const location = await this.prisma.viTri.findUnique({ where: { id } });
    if (!location) throw new NotFoundException('ID không hợp lệ');
    return this.response(location);
  }

  async create(dto: CreateLocationDto) {
    const created = await this.prisma.viTri.create({ data: dto });
    return this.response(created, 201);
  }

  async update(id: number, dto: UpdateLocationDto) {
    await this.getById(id);
    const updated = await this.prisma.viTri.update({
      where: { id },
      data: dto,
    });
    return this.response(updated);
  }

  async remove(id: number) {
    await this.getById(id);
    const deleted = await this.prisma.viTri.delete({ where: { id } });
    return this.response(deleted);
  }

  async paginate(pageIndex = 1, pageSize = 10, keyword = '') {
    const skip = (Number(pageIndex) - 1) * Number(pageSize);

    const [data, totalRow] = await Promise.all([
      this.prisma.viTri.findMany({
        skip,
        take: Number(pageSize),
        where: keyword ? { ten_vi_tri: { contains: keyword } } : undefined,
      }),
      this.prisma.viTri.count({
        where: keyword ? { ten_vi_tri: { contains: keyword } } : undefined,
      }),
    ]);

    return this.response({
      pageIndex: Number(pageIndex),
      pageSize: Number(pageSize),
      totalRow,
      keywords: keyword ? `TenViTri LIKE N'%${keyword}%'` : null,
      data,
    });
  }

  async uploadImage(id: number, filePath: string) {
    await this.getById(id);

    const updated = await this.prisma.viTri.update({
      where: { id },
      data: { hinh_anh: filePath },
    });

    return this.response({
      message: 'Upload hình thành công',
      data: updated,
    });
  }
}
