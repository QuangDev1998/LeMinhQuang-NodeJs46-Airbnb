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
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getAll() {
    const data = await this.roomService.getAll();
    return {
      statusCode: 200,
      content: data,
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
  @ApiResponse({ status: 200, description: 'Upload successful' })
  @UseInterceptors(
    FileInterceptor('formFile', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadImage(
    @Query('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = `uploads/${file.filename}`;
    return this.roomService.uploadImage(+id, filePath);
  }
}
