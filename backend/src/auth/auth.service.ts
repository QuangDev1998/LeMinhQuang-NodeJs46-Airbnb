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
        // Chấp nhận cả boolean true lẫn chuỗi 'true'
        gender: (dto.gender as unknown) === true || dto.gender === 'true',
        role: dto.role || 'USER',
      },
    });

    return {
      success: true,
      message: 'Đăng ký thành công',
    };
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.nguoiDung.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isMatch = await bcrypt.compare(dto.pass_word, user.pass_word);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    const tokens = this.signToken(user.id, user.email, user.role);
    return {
      ...tokens,
      user: this.excludePassword(user),
    };
  }

  // 🔄 Cấp lại access_token mới từ refresh_token hợp lệ
  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Thiếu refresh token');
    }
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });
      const user = await this.prisma.nguoiDung.findUnique({
        where: { id: payload.sub },
      });
      if (!user) throw new UnauthorizedException('Người dùng không tồn tại');

      const tokens = this.signToken(user.id, user.email, user.role);
      return {
        ...tokens,
        user: this.excludePassword(user),
      };
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  // 📘 Đăng nhập / đăng ký bằng Facebook (xác thực token phía server)
  async facebookLogin(accessToken: string) {
    if (!accessToken) {
      throw new BadRequestException('Thiếu Facebook access token');
    }

    let fbData: any;
    try {
      const res = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${encodeURIComponent(
          accessToken,
        )}`,
      );
      fbData = await res.json();
    } catch {
      throw new UnauthorizedException('Không xác thực được với Facebook');
    }

    if (!fbData || fbData.error || !fbData.id) {
      throw new UnauthorizedException('Facebook access token không hợp lệ');
    }

    // FB có thể không trả email -> dùng email giả ổn định theo id
    const email = fbData.email || `fb_${fbData.id}@facebook.local`;
    const avatar = fbData.picture?.data?.url ?? null;

    let user = await this.prisma.nguoiDung.findUnique({ where: { email } });

    if (!user) {
      // Mỗi user FB có mật khẩu ngẫu nhiên đã hash (không dùng mật khẩu chung)
      const randomPassword = await bcrypt.hash(
        `fb_${fbData.id}_${Date.now()}_${Math.random()}`,
        10,
      );
      user = await this.prisma.nguoiDung.create({
        data: {
          name: fbData.name || 'Facebook User',
          email,
          pass_word: randomPassword,
          phone: '',
          gender: false,
          role: 'USER',
          avatar,
        },
      });
    } else if (avatar && user.avatar !== avatar) {
      // Đồng bộ avatar mới nhất từ Facebook
      user = await this.prisma.nguoiDung.update({
        where: { id: user.id },
        data: { avatar },
      });
    }

    const tokens = this.signToken(user.id, user.email, user.role);
    return {
      ...tokens,
      user: this.excludePassword(user),
    };
  }

  private signToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
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
