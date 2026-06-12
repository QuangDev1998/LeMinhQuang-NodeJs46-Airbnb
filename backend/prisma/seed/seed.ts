import { PrismaClient } from '@prisma/client';
import { locations, users, rooms, bookings, comments } from './data';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 💣 Dọn sạch database trước khi seed
  await prisma.binhLuan.deleteMany();
  await prisma.datPhong.deleteMany();
  await prisma.phong.deleteMany();
  await prisma.nguoiDung.deleteMany();
  await prisma.viTri.deleteMany();

  // 🔁 Reset AUTO_INCREMENT để ID luôn bắt đầu từ 1 (ổn định giữa các lần seed).
  // Cú pháp này chỉ đúng với MySQL -> bỏ qua nếu DB khác (vd SQLite trên Render demo).
  for (const table of ['BinhLuan', 'DatPhong', 'Phong', 'NguoiDung', 'ViTri']) {
    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`,
      );
    } catch {
      // SQLite/Postgres không hỗ trợ -> không sao
    }
  }

  console.log('🌱 Bắt đầu seeding...\n');

  // ✅ Seed Locations
  await prisma.viTri.createMany({ data: locations });
  console.log('✅ Seeded Locations');

  const allLocations = await prisma.viTri.findMany();

  // ✅ Seed Users (hash password + avatar)
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const hashedPassword = await bcrypt.hash(user.pass_word, 10);
    await prisma.nguoiDung.create({
      data: { ...user, pass_word: hashedPassword },
    });
  }
  console.log('✅ Seeded Users');

  const allUsers = await prisma.nguoiDung.findMany();

  // ✅ Seed Rooms (mapping locationName to vi_tri_id)
  for (const room of rooms) {
    const location = allLocations.find(
      (loc) => loc.ten_vi_tri === room.locationName,
    );
    if (!location) continue;

    const { locationName, ...roomData } = room;
    await prisma.phong.create({
      data: {
        ...roomData,
        vi_tri_id: location.id,
      },
    });
  }
  console.log('✅ Seeded Rooms');

  const allRooms = await prisma.phong.findMany();

  // ✅ Seed Bookings (mapping userEmail & roomName)
  for (const booking of bookings) {
    const user = allUsers.find((u) => u.email === booking.userEmail);
    const room = allRooms.find((r) => r.ten_phong === booking.roomName);
    if (!user || !room) continue;

    const { userEmail, roomName, ...bookingData } = booking;
    await prisma.datPhong.create({
      data: {
        ...bookingData,
        ma_nguoi_dat: user.id,
        ma_phong: room.id,
      },
    });
  }
  console.log('✅ Seeded Bookings');

  // ✅ Seed Comments (mapping userEmail & roomName)
  for (const comment of comments) {
    const user = allUsers.find((u) => u.email === comment.userEmail);
    const room = allRooms.find((r) => r.ten_phong === comment.roomName);
    if (!user || !room) continue;

    const { userEmail, roomName, ...commentData } = comment;
    await prisma.binhLuan.create({
      data: {
        ...commentData,
        ma_nguoi_binh_luan: user.id,
        ma_phong: room.id,
      },
    });
  }
  console.log('✅ Seeded Comments');

  console.log('\n🌱 Seeding hoàn tất!');
}

main()
  .catch((err) => {
    console.error('❌ Lỗi seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
