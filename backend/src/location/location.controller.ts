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
import { LocationService } from './location.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/location.dto';
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

@ApiTags('ViTri')
@Controller('vi-tri')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  getAll() {
    return this.locationService.getAll();
  }

  @Get('phan-trang-tim-kiem')
  @ApiQuery({ name: 'pageIndex', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  paginate(
    @Query('pageIndex') pageIndex = 1,
    @Query('pageSize') pageSize = 10,
    @Query('keyword') keyword = '',
  ) {
    return this.locationService.paginate(
      Number(pageIndex),
      Number(pageSize),
      keyword,
    );
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.locationService.getById(Number(id));
  }

  @Post()
  @ApiBody({ type: CreateLocationDto })
  create(@Body() dto: CreateLocationDto) {
    return this.locationService.create(dto);
  }

  @Put()
  @ApiBody({ type: UpdateLocationDto })
  update(@Body() dto: UpdateLocationDto) {
    return this.locationService.update(dto.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(Number(id));
  }

  @Post('upload-hinh-vitri')
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'maViTri', required: true, description: 'ID vị trí' })
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
  @ApiResponse({ status: 200, description: 'Success' })
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
    @Query('maViTri') maViTri: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = `uploads/${file.filename}`;
    return this.locationService.uploadImage(Number(maViTri), filePath);
  }
}
