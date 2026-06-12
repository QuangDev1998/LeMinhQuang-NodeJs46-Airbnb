import { http } from "./config";

// Chỉ thêm ngayDen/ngayDi vào query khi tạo thành khoảng hợp lệ (đi > đến).
// BE parse bằng new Date(...) nên gửi ISO string.
const appendDates = (params, ngayDen, ngayDi) => {
  if (ngayDen && ngayDi) {
    const den = new Date(ngayDen);
    const di = new Date(ngayDi);
    if (!isNaN(den) && !isNaN(di) && di > den) {
      params.set("ngayDen", den.toISOString());
      params.set("ngayDi", di.toISOString());
    }
  }
  return params;
};

export const phongServices = {
  // Lấy toàn bộ phòng
  getListPhong: () => http.get(`/rooms`),

  // Lấy phòng theo loại (category) + tuỳ chọn lọc theo ngày trống.
  // Bỏ trống / "Tất cả" => tất cả loại.
  getListPhongByCategory: (category, ngayDen, ngayDi) => {
    const params = new URLSearchParams();
    if (category && category !== "Tất cả") params.set("category", category);
    appendDates(params, ngayDen, ngayDi);
    const qs = params.toString();
    return http.get(qs ? `/rooms?${qs}` : `/rooms`);
  },

  // Danh mục loại chỗ ở (kèm số lượng)
  getCategories: () => http.get(`/rooms/categories`),

  // Tìm kiếm và phân trang
  findPhong: (pageIndex, pageSize, keyword = "") =>
    http.get(
      `/rooms/search?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
    ),

  // Lấy phòng theo vị trí + tuỳ chọn lọc theo ngày trống
  locationPhong: (id, ngayDen, ngayDi) => {
    const params = new URLSearchParams({ locationId: id });
    appendDates(params, ngayDen, ngayDi);
    return http.get(`/rooms/by-location?${params.toString()}`);
  },

  // Xoá phòng
  deletePhong: (id, tokenBearer) =>
    http.delete(`/rooms/${id}`, {
      headers: { token: tokenBearer },
    }),

  // Lấy chi tiết phòng
  getPhongInfo: (id) => http.get(`/rooms/${id}`),

  // Tạo phòng mới
  createPhong: (phongData, tokenBearer) =>
    http.post(`/rooms`, toRoomPayload(phongData), {
      headers: { token: tokenBearer },
    }),

  // Upload hình phòng
  uploadHinhPhong: (formData, maPhong, tokenBearer) =>
    http.post(`/rooms/upload-image?id=${maPhong}`, formData, {
      headers: { token: tokenBearer },
    }),

  // Chỉnh sửa phòng
  editPhong: (id, phongData, tokenBearer) =>
    http.put(`/rooms/${id}`, toRoomPayload(phongData), {
      headers: { token: tokenBearer },
    }),
};

// Form admin dùng camelCase, nhưng DTO backend (CreateRoomDto/UpdateRoomDto) là snake_case.
// Chỉ map các field có trong payload để PUT (partial update) vẫn đúng.
function toRoomPayload(v = {}) {
  const map = {
    tenPhong: "ten_phong",
    khach: "khach",
    phongNgu: "phong_ngu",
    giuong: "giuong",
    phongTam: "phong_tam",
    moTa: "mo_ta",
    giaTien: "gia_tien",
    mayGiat: "may_giat",
    banLa: "ban_la",
    tivi: "tivi",
    dieuHoa: "dieu_hoa",
    wifi: "wifi",
    bep: "bep",
    doXe: "do_xe",
    hoBoi: "ho_boi",
    banUi: "ban_ui",
    hinhAnh: "hinh_anh",
    maViTri: "vi_tri_id",
  };
  const out = {};
  Object.keys(map).forEach((k) => {
    if (v[k] !== undefined) out[map[k]] = v[k];
  });
  return out;
}
