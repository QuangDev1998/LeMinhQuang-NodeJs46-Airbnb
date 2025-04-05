import { NguoiDung } from '@prisma/client';

declare module 'express' {
  interface Request {
    user: NguoiDung;
  }
}
