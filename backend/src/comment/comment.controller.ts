import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { Request } from 'express';

type CurrentUser = { id: number; role: string };

@ApiTags('BinhLuan')
@ApiBearerAuth('access-token')
@Controller('binh-luan')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getAll() {
    return this.commentService.getAll();
  }

  // BẢO MẬT: người bình luận = user đang đăng nhập (bỏ qua ma_nguoi_binh_luan từ body)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCommentDto, @Req() req: Request) {
    return this.commentService.create(dto, (req.user as CurrentUser).id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() dto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    return this.commentService.update(+id, dto, req.user as CurrentUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.commentService.remove(+id, req.user as CurrentUser);
  }

  @Get('lay-binh-luan-theo-phong/:maPhong')
  getByRoom(@Param('maPhong') maPhong: number) {
    return this.commentService.getByRoom(+maPhong);
  }
}
