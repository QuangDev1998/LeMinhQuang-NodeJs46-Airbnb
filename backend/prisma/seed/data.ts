import { Prisma } from '@prisma/client';

// ========================== LOCATION ==========================
export const locations: Prisma.ViTriCreateManyInput[] = [
  {
    ten_vi_tri: 'Hồ Chí Minh',
    tinh_thanh: 'Hồ Chí Minh',
    quoc_gia: 'Việt Nam',
    hinh_anh: 'https://picsum.photos/id/1011/300/200',
  },
  {
    ten_vi_tri: 'Cần Thơ',
    tinh_thanh: 'Cần Thơ',
    quoc_gia: 'Việt Nam',
    hinh_anh: 'https://picsum.photos/id/1012/300/200',
  },
  {
    ten_vi_tri: 'Nha Trang',
    tinh_thanh: 'Khánh Hòa',
    quoc_gia: 'Việt Nam',
    hinh_anh: 'https://picsum.photos/id/1013/300/200',
  },
  {
    ten_vi_tri: 'Hà Nội',
    tinh_thanh: 'Hà Nội',
    quoc_gia: 'Việt Nam',
    hinh_anh: 'https://picsum.photos/id/1014/300/200',
  },
  {
    ten_vi_tri: 'Phú Quốc',
    tinh_thanh: 'Kiên Giang',
    quoc_gia: 'Việt Nam',
    hinh_anh: 'https://picsum.photos/id/1015/300/200',
  },
  {
    ten_vi_tri: 'Đà Nẵng',
    tinh_thanh: 'Đà Nẵng',
    quoc_gia: 'Việt Nam',
    hinh_anh: 'https://picsum.photos/id/1016/300/200',
  },
  {
    ten_vi_tri: 'Đà Lạt',
    tinh_thanh: 'Lâm Đồng',
    quoc_gia: 'Việt Nam',
    hinh_anh: 'https://picsum.photos/id/1017/300/200',
  },
  {
    ten_vi_tri: 'Phan Thiết',
    tinh_thanh: 'Bình Thuận',
    quoc_gia: 'Việt Nam',
    hinh_anh: 'https://picsum.photos/id/1018/300/200',
  },
];

// ========================== USERS ==========================
export const users: Prisma.NguoiDungCreateManyInput[] = [
  {
    name: 'Nguyễn Văn A',
    email: 'a@gmail.com',
    pass_word: '123456',
    phone: '0123456789',
    birth_day: new Date('2000-01-01'),
    gender: true,
    role: 'USER',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Trần Thị B',
    email: 'b@gmail.com',
    pass_word: '123456',
    phone: '0987654321',
    birth_day: new Date('1998-05-20'),
    gender: false,
    role: 'CHU_NHA',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Admin C',
    email: 'admin@gmail.com',
    pass_word: 'admin123',
    phone: '0909090909',
    birth_day: new Date('1995-07-15'),
    gender: true,
    role: 'ADMIN',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'Phạm Minh D',
    email: 'd@gmail.com',
    pass_word: '123456',
    phone: '0911111111',
    birth_day: new Date('1997-09-12'),
    gender: true,
    role: 'CHU_NHA',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    name: 'Lê Thị E',
    email: 'e@gmail.com',
    pass_word: '123456',
    phone: '0933333333',
    birth_day: new Date('1999-11-22'),
    gender: false,
    role: 'USER',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'Admin Trần Văn F',
    email: 'f@gmail.com',
    pass_word: 'admin123',
    phone: '0966666666',
    birth_day: new Date('1992-03-18'),
    gender: true,
    role: 'ADMIN',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
];

// ========================== ROOMS ==========================
// Gán tên location vào room thay vì vi_tri_id để mapping trong seed.ts
export const rooms: (Omit<Prisma.PhongCreateManyInput, 'vi_tri_id'> & {
  locationName: string;
})[] = [];

// Danh mục loại chỗ ở kiểu Airbnb
export const ROOM_CATEGORIES = [
  'Phòng',
  'Hồ bơi tuyệt vời',
  'Bãi biển',
  'Cabin gỗ',
  'Trang trại',
  'Nhà nhỏ xinh',
  'Tuyệt tác kiến trúc',
  'Trên mặt nước',
  'Khung cảnh tuyệt vời',
  'Thành phố nổi tiếng',
];

for (let i = 0; i < 80; i++) {
  const locationIndex = i % locations.length;
  const locationName = locations[locationIndex].ten_vi_tri;
  const loaiPhong = ROOM_CATEGORIES[i % ROOM_CATEGORIES.length];

  // Bộ ảnh gallery ổn định cho mỗi phòng (5 ảnh)
  const gallery = Array.from(
    { length: 5 },
    (_, g) => `https://picsum.photos/seed/room-${i + 1}-${g}/1200/800`,
  );

  rooms.push({
    ten_phong: `Phòng ${i + 1} tại ${locationName}`,
    khach: Math.floor(Math.random() * 6) + 1,
    phong_ngu: Math.floor(Math.random() * 3) + 1,
    giuong: Math.floor(Math.random() * 3) + 1,
    phong_tam: Math.floor(Math.random() * 2) + 1,
    mo_ta: `Tận hưởng kỳ nghỉ tuyệt vời tại ${loaiPhong.toLowerCase()} số ${
      i + 1
    } ở ${locationName}. Không gian thoáng đãng, đầy đủ tiện nghi, vị trí thuận tiện cho việc di chuyển và khám phá.`,
    gia_tien: Math.floor(Math.random() * 1200000) + 300000,
    may_giat: Math.random() > 0.5,
    ban_la: Math.random() > 0.5,
    tivi: Math.random() > 0.5,
    dieu_hoa: Math.random() > 0.5,
    wifi: true,
    bep: Math.random() > 0.5,
    do_xe: Math.random() > 0.5,
    ho_boi: Math.random() > 0.5,
    ban_ui: Math.random() > 0.5,
    hinh_anh: gallery[0],
    loai_phong: loaiPhong,
    danh_sach_anh: JSON.stringify(gallery),
    locationName,
  });
}

// ========================== BOOKINGS & COMMENTS ==========================
// Gán bằng email + room name → sẽ mapping id trong seed.ts
export const bookings: (Omit<
  Prisma.DatPhongCreateManyInput,
  'ma_phong' | 'ma_nguoi_dat'
> & {
  roomName: string;
  userEmail: string;
})[] = [];

export const comments: (Omit<
  Prisma.BinhLuanCreateManyInput,
  'ma_phong' | 'ma_nguoi_binh_luan'
> & {
  roomName: string;
  userEmail: string;
})[] = [];

for (let i = 0; i < 100; i++) {
  const room = rooms[i % rooms.length];
  const user = users[i % users.length];
  const startDate = new Date(
    2025,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1,
  );
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5) + 1);

  bookings.push({
    roomName: room.ten_phong,
    userEmail: user.email,
    ngay_den: startDate,
    ngay_di: endDate,
    so_luong_khach: Math.floor(Math.random() * 4) + 1,
  });

  comments.push({
    roomName: room.ten_phong,
    userEmail: user.email,
    ngay_binh_luan: new Date(),
    noi_dung: 'Nội dung gì đó',
    sao_binh_luan: Math.floor(Math.random() * 5) + 1,
  });
}
