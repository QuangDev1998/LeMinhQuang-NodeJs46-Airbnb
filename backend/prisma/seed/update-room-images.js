/**
 * Cập nhật ảnh phòng bằng ảnh chỗ ở THẬT (Unsplash, miễn phí bản quyền),
 * chọn theo từng loại phòng để giống listing Airbnb thực tế.
 * Chạy:  DATABASE_URL="mysql://root:123456@localhost:3307/airbnb_db" node prisma/seed/update-room-images.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const img = (id) =>
  `https://images.unsplash.com/${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`;

// Pool ảnh nội thất phòng (dùng làm ảnh trong gallery cho mọi loại)
const INTERIOR = [
  'photo-1505693416388-ac5ce068fe85',
  'photo-1502672260266-1c1ef2d93688',
  'photo-1522708323590-d24dbb6b0267',
  'photo-1560448204-e02f11c3d0e2',
  'photo-1560185007-cde436f6a4d0',
  'photo-1493809842364-78817add7ffb',
  'photo-1586023492125-27b2c045efd7',
  'photo-1484154218962-a197022b5858',
  'photo-1567767292278-a4f21aa2d36e',
  'photo-1505691938895-1758d7feb511',
  'photo-1540518614846-7eded433c457',
];

// Ảnh bìa (đúng chủ đề) theo từng loại phòng
const COVERS = {
  'Phòng': INTERIOR,
  'Hồ bơi tuyệt vời': [
    'photo-1571896349842-33c89424de2d',
    'photo-1582719508461-905c673771fd',
    'photo-1540541338287-41700207dee6',
    'photo-1566073771259-6a8506099945',
    'photo-1551882547-ff40c63fe5fa',
    'photo-1584132967334-10e028bd69f7',
  ],
  'Bãi biển': [
    'photo-1507525428034-b723cf961d3e',
    'photo-1519046904884-53103b34b206',
    'photo-1505881502353-a1986add3762',
    'photo-1473116763249-2faaef81ccda',
    'photo-1520250497591-112f2f40a3f4',
  ],
  'Cabin gỗ': [
    'photo-1449158743715-0a90ebb6d2d8',
    'photo-1518780664697-55e3ad937233',
    'photo-1542718610-a1d656d1884c',
    'photo-1601918774946-25832a4be0d6',
    'photo-1510798831971-661eb04b3739',
  ],
  'Trang trại': [
    'photo-1500382017468-9049fed747ef',
    'photo-1464822759023-fed622ff2c3b',
    'photo-1466692476868-aef1dfb1e735',
  ],
  // Nhà nhỏ xinh: dùng cabin/nhà gỗ nhỏ ấm cúng
  'Nhà nhỏ xinh': [
    'photo-1518780664697-55e3ad937233',
    'photo-1510798831971-661eb04b3739',
    'photo-1449158743715-0a90ebb6d2d8',
    'photo-1601918774946-25832a4be0d6',
  ],
  'Tuyệt tác kiến trúc': [
    'photo-1487958449943-2429e8be8625',
    'photo-1518005020951-eccb494ad742',
    'photo-1511818966892-d7d671e672a2',
    'photo-1449844908441-8829872d2607',
  ],
  'Trên mặt nước': [
    'photo-1439066615861-d1af74d74000',
    'photo-1582610116397-edb318620f90',
    'photo-1573843981267-be1999ff37cd',
    'photo-1540202404-a2f29016b523',
  ],
  'Khung cảnh tuyệt vời': [
    'photo-1506905925346-21bda4d32df4',
    'photo-1521401830884-6c03c1c87ebb',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1454496522488-7a8e488e8606',
  ],
  'Thành phố nổi tiếng': [
    'photo-1502602898657-3e91760cbb34',
    'photo-1538970272646-f61fabb3a8a2',
    'photo-1496442226666-8d4d0e62e6e9',
    'photo-1513635269975-59663e0ac1ad',
  ],
};

const pick = (arr, i) => arr[((i % arr.length) + arr.length) % arr.length];

(async () => {
  const rooms = await prisma.phong.findMany({ orderBy: { id: 'asc' } });
  // Đếm thứ tự phòng trong từng loại để mỗi phòng nhận ảnh khác nhau
  const idxByType = {};
  let updated = 0;

  for (const room of rooms) {
    const type = room.loai_phong || 'Phòng';
    const i = (idxByType[type] = (idxByType[type] ?? -1) + 1);
    const covers = COVERS[type] || INTERIOR;

    const cover = pick(covers, i);
    // Gallery: ảnh chủ đề + nội thất thật xen kẽ -> giống bộ ảnh listing
    const gallery = [
      cover,
      pick(INTERIOR, i),
      pick(INTERIOR, i + 3),
      pick(covers, i + 1),
      pick(INTERIOR, i + 6),
    ].map(img);

    await prisma.phong.update({
      where: { id: room.id },
      data: {
        hinh_anh: img(cover),
        danh_sach_anh: JSON.stringify(gallery),
      },
    });
    updated++;
  }

  console.log(`✅ Đã cập nhật ảnh cho ${updated} phòng.`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error('❌ Lỗi:', e.message);
  await prisma.$disconnect();
  process.exit(1);
});
