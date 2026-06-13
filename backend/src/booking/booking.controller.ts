import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';

type CurrentUser = { id: number; role: string };

@ApiTags('DatPhong')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('dat-phong')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // BẢO MẬT: chỉ ADMIN mới được xem TẤT CẢ booking
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAll() {
    return this.bookingService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.bookingService.getById(id, req.user as CurrentUser);
  }

  // BẢO MẬT: booking luôn gắn với người đang đăng nhập (bỏ qua ma_nguoi_dat từ body)
  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req: Request) {
    return this.bookingService.create(dto, (req.user as CurrentUser).id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
    @Req() req: Request,
  ) {
    return this.bookingService.update(id, dto, req.user as CurrentUser);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.bookingService.remove(id, req.user as CurrentUser);
  }

  // BẢO MẬT: chỉ xem được booking của chính mình (admin xem được của mọi người)
  @Get('lay-theo-nguoi-dung/:maNguoiDung')
  getByUser(
    @Param('maNguoiDung', ParseIntPipe) maNguoiDung: number,
    @Req() req: Request,
  ) {
    return this.bookingService.getByUser(maNguoiDung, req.user as CurrentUser);
  }
}
