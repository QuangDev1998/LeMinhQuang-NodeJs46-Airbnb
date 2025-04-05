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
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@ApiTags('BinhLuan')
@ApiBearerAuth('access-token')
@Controller('binh-luan')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getAll() {
    return this.commentService.getAll();
  }

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentService.remove(+id);
  }

  @Get('lay-binh-luan-theo-phong/:maPhong')
  getByRoom(@Param('maPhong') maPhong: number) {
    return this.commentService.getByRoom(+maPhong);
  }
}
