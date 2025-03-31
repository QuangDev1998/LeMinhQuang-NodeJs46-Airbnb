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
import { LocationService } from './location.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/location.dto';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guards';

@ApiTags('ViTri')
@ApiBearerAuth('access-token')
@Controller('vi-tri')
@UseGuards(JwtAuthGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  getAll() {
    return this.locationService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.locationService.getById(Number(id));
  }

  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.locationService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.locationService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(Number(id));
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

  @Post('upload-hinh-vitri')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Query('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = `uploads/${file.filename}`;
    return this.locationService.uploadImage(Number(id), filePath);
  }
}
