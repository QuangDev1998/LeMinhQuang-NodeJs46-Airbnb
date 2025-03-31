import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@ApiTags('DatPhong')
@ApiBearerAuth('access-token')
@Controller('api/dat-phong')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  getAll() {
    return this.bookingService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.bookingService.getById(+id);
  }

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateBookingDto) {
    return this.bookingService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookingService.remove(+id);
  }

  @Get('lay-theo-nguoi-dung/:maNguoiDung')
  getByUser(@Param('maNguoiDung') maNguoiDung: number) {
    return this.bookingService.getByUser(+maNguoiDung);
  }
}
