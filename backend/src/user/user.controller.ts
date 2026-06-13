import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  Req,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';
import { memoryStorage } from 'multer';

@ApiTags('NguoiDung')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // BẢO MẬT: danh sách user chứa email/SĐT/ngày sinh -> chỉ ADMIN
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAll() {
    return this.userService.getAll();
  }

  @Get('/phan-trang-tim-kiem')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getPaging(
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.userService.getPaging(pageIndex, pageSize, keyword);
  }

  // BẢO MẬT: chỉ chính chủ hoặc admin mới xem thông tin 1 user
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  getById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const current = req.user as { id: number; role: string };
    if (current.role !== 'ADMIN' && current.id !== id) {
      throw new ForbiddenException('Bạn chỉ được xem thông tin của chính mình');
    }
    return this.userService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
  ) {
    // Chỉ chính chủ hoặc admin mới được sửa thông tin
    const current = req.user as { id: number; role: string };
    if (current.role !== 'ADMIN' && current.id !== id) {
      throw new ForbiddenException('Bạn chỉ được sửa thông tin của chính mình');
    }
    // Người dùng thường không được tự nâng quyền
    if (current.role !== 'ADMIN') {
      delete dto.role;
    }
    return this.userService.update(id, dto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  delete(@Query('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
  // ✅ Upload avatar lên Cloudinary
  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('formFile', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
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
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.userService.uploadAvatar(req.user['id'], file);
  }
}
