import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getAll() {
    const result = await this.roomService.getAll();
    return {
      statusCode: 200,
      content: result,
      message: 'Lấy danh sách phòng thành công',
      dateTime: new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
      }),
    };
  }

  @Get('search')
  @ApiQuery({ name: 'pageIndex', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  async searchRooms(
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword?: string,
  ) {
    return this.roomService.paginate(+pageIndex, +pageSize, keyword);
  }

  @Get('by-location')
  @ApiQuery({ name: 'locationId', required: true, type: Number })
  async getByLocation(@Query('locationId') locationId: number) {
    const data = await this.roomService.getByLocation(+locationId);
    return {
      statusCode: 200,
      content: data,
      message: 'Lấy danh sách phòng theo vị trí thành công',
      dateTime: new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
      }),
    };
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.roomService.getById(+id);
  }

  @Post()
  @ApiBody({ type: CreateRoomDto })
  async create(@Body() dto: CreateRoomDto) {
    return this.roomService.create(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateRoomDto })
  async update(@Param('id') id: number, @Body() dto: UpdateRoomDto) {
    return this.roomService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.roomService.remove(+id);
  }

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'id', required: true, description: 'Room ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        formFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Upload hình ảnh phòng thành công',
  })
  @UseInterceptors(FileInterceptor('formFile'))
  async uploadImageCloud(
    @Query('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || !file.buffer || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Vui lòng chọn file hình hợp lệ');
    }

    const result = await this.roomService.uploadImageCloud(+id, file);
    return {
      statusCode: 200,
      content: result,
      message: 'Upload hình ảnh thành công',
      dateTime: new Date().toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
      }),
    };
  }
}
