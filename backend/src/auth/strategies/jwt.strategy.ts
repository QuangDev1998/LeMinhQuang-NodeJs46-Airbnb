import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('ACCESS_TOKEN_SECRET');
    // BẢO MẬT: KHÔNG fallback 'secret'. Thiếu env -> dừng app ngay
    // (tránh ký/verify token bằng secret đoán được => giả mạo JWT).
    if (!secret) {
      throw new Error(
        'ACCESS_TOKEN_SECRET chưa được cấu hình trong biến môi trường',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  validate(payload: any) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
