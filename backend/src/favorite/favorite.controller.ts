import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { FavoriteService } from './favorite.service';
import { ToggleFavoriteDto } from './dto/favorite.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Favorites')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('yeu-thich')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('toggle')
  toggle(@Req() req: Request, @Body() dto: ToggleFavoriteDto) {
    const userId = (req.user as { id: number }).id;
    return this.favoriteService.toggle(userId, dto.maPhong);
  }

  @Get()
  getMyFavorites(@Req() req: Request) {
    const userId = (req.user as { id: number }).id;
    return this.favoriteService.getMyFavorites(userId);
  }

  @Get('ids')
  getMyFavoriteIds(@Req() req: Request) {
    const userId = (req.user as { id: number }).id;
    return this.favoriteService.getMyFavoriteIds(userId);
  }
}
