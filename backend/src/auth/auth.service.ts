import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SigninDto, SignupDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    if (!dto.email) throw new BadRequestException('Email là bắt buộc');

    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hash = await bcrypt.hash(dto.pass_word, 10);

    const user = await this.prisma.nguoiDung.create({
      data: {
        name: dto.name,
        email: dto.email,
        pass_word: hash,
        phone: dto.phone || '',
        birth_day: dto.birth_day ? new Date(dto.birth_day) : null,
        gender: dto.gender || '',
        role: dto.role || 'USER',
      },
    });

    const tokens = this.signToken(user.id, user.email);
    return {
      ...tokens,
      user: this.excludePassword(user),
    };
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.nguoiDung.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isMatch = await bcrypt.compare(dto.pass_word, user.pass_word);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    const tokens = this.signToken(user.id, user.email);
    return {
      ...tokens,
      user: this.excludePassword(user),
    };
  }

  private signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    const access_token = this.jwt.sign(payload, {
      secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.config.get<string>('ACCESS_TOKEN_EXPIRED'),
    });
    const refresh_token = this.jwt.sign(payload, {
      secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.config.get<string>('REFRESH_TOKEN_EXPIRED'),
    });
    return { access_token, refresh_token };
  }

  // 🔐 Utility: loại bỏ pass_word khi trả user ra ngoài
  private excludePassword(user: any) {
    const { pass_word, ...result } = user;
    return result;
  }
}
