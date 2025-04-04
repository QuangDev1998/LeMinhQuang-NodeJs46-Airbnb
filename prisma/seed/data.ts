import { Prisma } from '@prisma/client';

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

export const users: Prisma.NguoiDungCreateManyInput[] = [
  {
    name: 'Nguyễn Văn A',
    email: 'a@gmail.com',
    pass_word: '123456',
    phone: '0123456789',
    birth_day: new Date('2000-01-01'),
    gender: 'male',
    role: 'USER',
  },
  {
    name: 'Trần Thị B',
    email: 'b@gmail.com',
    pass_word: '123456',
    phone: '0987654321',
    birth_day: new Date('1998-05-20'),
    gender: 'female',
    role: 'USER',
  },
  {
    name: 'Admin C',
    email: 'admin@gmail.com',
    pass_word: 'admin123',
    phone: '0909090909',
    birth_day: new Date('1995-07-15'),
    gender: 'male',
    role: 'ADMIN',
  },
];

export const rooms: Prisma.PhongCreateManyInput[] = [];

for (let locationId = 1; locationId <= 8; locationId++) {
  for (let i = 1; i <= 10; i++) {
    rooms.push({
      ten_phong: `Phòng ${i} tại Location ${locationId}`,
      khach: Math.floor(Math.random() * 6) + 1,
      phong_ngu: Math.floor(Math.random() * 3) + 1,
      giuong: Math.floor(Math.random() * 3) + 1,
      phong_tam: Math.floor(Math.random() * 2) + 1,
      mo_ta: `Phòng đẹp số ${i} tại địa điểm ${locationId}`,
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
      hinh_anh: `https://picsum.photos/id/${200 + (locationId - 1) * 10 + i}/300/200`,
      vi_tri_id: locationId,
    });
  }
}

export const bookings: Prisma.DatPhongCreateManyInput[] = [];
export const comments: Prisma.BinhLuanCreateManyInput[] = [];

for (let i = 1; i <= 100; i++) {
  const ma_phong = (i % 80) + 1;
  const ma_nguoi_dat = (i % 3) + 1;
  const startDate = new Date(
    2025,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1,
  );
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5) + 1);

  bookings.push({
    ma_phong,
    ngay_den: startDate,
    ngay_di: endDate,
    so_luong_khach: Math.floor(Math.random() * 4) + 1,
    ma_nguoi_dat,
  });

  comments.push({
    ma_cong_viec: ma_phong,
    ma_nguoi_binh_luan: ma_nguoi_dat,
    ngay_binh_luan: new Date(endDate),
    noi_dung: `Phòng số ${ma_phong} rất tuyệt vời!`,
    sao_binh_luan: Math.floor(Math.random() * 5) + 1,
  });
}
