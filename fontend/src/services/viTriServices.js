import { http } from "./config";

// Form admin dùng camelCase, DTO backend (CreateLocationDto/UpdateLocationDto) là snake_case.
function toLocationPayload(v = {}) {
  const out = {};
  if (v.id !== undefined) out.id = v.id;
  if (v.tenViTri !== undefined) out.ten_vi_tri = v.tenViTri;
  if (v.tinhThanh !== undefined) out.tinh_thanh = v.tinhThanh;
  if (v.quocGia !== undefined) out.quoc_gia = v.quocGia;
  if (v.hinhAnh !== undefined) out.hinh_anh = v.hinhAnh;
  return out;
}

export let viTriServices = {
  getListViTri: () => http.get(`/vi-tri`),
  uploadHinhViTri: (formData, id, tokenBearer) =>
    http.post(`/vi-tri/upload-hinh-vitri?maViTri=${id}`, formData, {
      headers: { token: tokenBearer },
    }),
  addVitri: (viTriData, tokenBearer) =>
    http.post(`/vi-tri`, toLocationPayload(viTriData), {
      headers: { token: tokenBearer },
    }),
  deleteViTri: (id, tokenBearer) =>
    http.delete(`/vi-tri/${id}`, { headers: { token: tokenBearer } }),
  // Phân trang (keyword đầu tiên) - dùng cho trang chủ
  findViTri: (tinhThanh, pageIndex = 1, pageSize = 8) =>
    http.get(
      `/vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${tinhThanh}`
    ),
  // Phân trang (pageIndex, pageSize, keyword) - dùng cho trang quản trị
  findViTri2: (pageIndex = 1, pageSize = 10, keyword = "") =>
    http.get(
      `/vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
    ),
  getViTriInfo: (id) => http.get(`/vi-tri/${id}`),
  editViTri: (viTriData, tokenBearer) =>
    http.put(`/vi-tri`, toLocationPayload(viTriData), {
      headers: { token: tokenBearer },
    }),
};
