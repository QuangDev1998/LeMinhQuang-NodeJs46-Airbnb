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
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/location.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateLocationDto })
  create(@Body() dto: CreateLocationDto) {
    return this.locationService.create(dto);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateLocationDto })
  update(@Body() dto: UpdateLocationDto) {
    return this.locationService.update(dto.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string) {
    return this.locationService.remove(Number(id));
  }

  @Post('upload-hinh-vitri')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
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
      limits: { fileSize: 5 * 1024 * 1024 }, // tối đa 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Chỉ cho phép upload file hình ảnh'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @Query('maViTri') maViTri: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file hình để upload');
    }
    const filePath = `uploads/${file.filename}`;
    return this.locationService.uploadImage(Number(maViTri), filePath);
  }
}
