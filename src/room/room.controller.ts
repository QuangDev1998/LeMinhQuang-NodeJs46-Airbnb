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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Phong')
@ApiBearerAuth('access-token')
@Controller('phong-thue')
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  getAll() {
    return this.roomService.getAll();
  }

  @Get('lay-phong-theo-vi-tri')
  getByLocation(@Query('viTriId') viTriId: number) {
    return this.roomService.getByLocation(+viTriId);
  }

  @Get('phan-trang-tim-kiem')
  @ApiQuery({
    name: 'pageIndex',
    required: false,
    type: Number,
    description: 'Trang hiện tại',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Số lượng mỗi trang',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Từ khóa tìm kiếm',
  })
  async paginate(
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword: string,
  ) {
    const result = await this.roomService.paginate(
      +pageIndex,
      +pageSize,
      keyword,
    );
    return {
      statusCode: 200,
      content: result,
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

  @Post('upload-hinh-phong')
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'id', required: true, description: 'ID phòng' })
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
  @ApiResponse({ status: 200, description: 'Upload thành công' })
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
