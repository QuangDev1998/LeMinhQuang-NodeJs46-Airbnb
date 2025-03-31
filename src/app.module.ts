import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    LocationModule,
    RoomModule,
    BookingModule,
    CommentModule,
  ],
})
export class AppModule {}
