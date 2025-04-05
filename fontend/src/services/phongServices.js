import { http } from "./config";

export const phongServices = {
  // Lấy toàn bộ phòng
  getListPhong: () => http.get(`/rooms`),

  // Tìm kiếm và phân trang
  findPhong: (pageIndex, pageSize, keyword = "") =>
    http.get(
      `/rooms/search?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
    ),

  // Lấy phòng theo vị trí
  locationPhong: (id) => http.get(`/rooms/by-location?locationId=${id}`),

  // Xoá phòng
  deletePhong: (id, tokenBearer) =>
    http.delete(`/rooms/${id}`, {
      headers: { token: tokenBearer },
    }),

  // Lấy chi tiết phòng
  getPhongInfo: (id) => http.get(`/rooms/${id}`),

  // Tạo phòng mới
  createPhong: (phongData, tokenBearer) =>
    http.post(`/rooms`, phongData, {
      headers: { token: tokenBearer },
    }),

  // Upload hình phòng
  uploadHinhPhong: (formData, maPhong, tokenBearer) =>
    http.post(`/rooms/upload-image?id=${maPhong}`, formData, {
      headers: { token: tokenBearer },
    }),

  // Chỉnh sửa phòng
  editPhong: (id, phongData, tokenBearer) =>
    http.put(`/rooms/${id}`, phongData, {
      headers: { token: tokenBearer },
    }),
};
