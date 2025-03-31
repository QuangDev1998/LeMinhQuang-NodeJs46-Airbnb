import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@ApiTags('Phong')
@ApiBearerAuth('access-token')
@Controller('api/phong-thue')
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  getAll() {
    return this.roomService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.roomService.getById(+id);
  }

  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.roomService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateRoomDto) {
    return this.roomService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roomService.remove(+id);
  }

  @Get('phan-trang-tim-kiem')
  paginate(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.roomService.paginate(+page, +pageSize);
  }

  @Get('lay-phong-theo-vi-tri')
  getByLocation(@Query('viTriId') viTriId: number) {
    return this.roomService.getByLocation(+viTriId);
  }

  @Post('upload-hinh-phong')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Query('id') id: number,
    @UploadedFile() file: Express.MulterFile,
  ) {
    const filePath = `uploads/${file.filename}`;
    return this.roomService.uploadImage(+id, filePath);
  }
}
