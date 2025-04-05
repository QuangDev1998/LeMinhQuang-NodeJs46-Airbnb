
import { PrismaClient } from '@prisma/client';
import { locations, users, rooms, bookings, comments } from './data';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seeding...');

  // Seed Location
  await prisma.viTri.createMany({ data: locations });
  console.log('✅ Seeded Location');

  // Seed User (hash password)
  for (const user of users) {
    const hash = await bcrypt.hash(user.pass_word, 10);
    await prisma.nguoiDung.create({
      data: { ...user, pass_word: hash },
    });
  }
  console.log('✅ Seeded User');

  // Seed Room
  await prisma.phong.createMany({ data: rooms });
  console.log('✅ Seeded Room');

  // Seed Booking
  await prisma.datPhong.createMany({ data: bookings });
  console.log('✅ Seeded Booking');

  // Seed Comment
  await prisma.binhLuan.createMany({ data: comments });
  console.log('✅ Seeded Comment');

  console.log('🌱 Seeding hoàn tất!');
}

main()
  .catch((err) => {
    console.error('❌ Lỗi seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
