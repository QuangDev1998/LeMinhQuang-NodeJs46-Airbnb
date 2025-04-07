import { http } from "./config";

export let viTriServices = {
  getListViTri: () => http.get(`/vi-tri`),
  uploadHinhViTri: (formData, id, tokenBearer) =>
    http.post(`/vi-tri/upload-hinh-vitri?maViTri=${id}`, formData, {
      headers: { token: tokenBearer },
    }),
  addVitri: (viTriData, tokenBearer) =>
    http.post(`/vi-tri`, viTriData, { headers: { token: tokenBearer } }),
  deleteViTri: (id, tokenBearer) =>
    http.delete(`/vi-tri/${id}`, { headers: { token: tokenBearer } }),
  findViTri: (tinhThanh, pageIndex = 1, pageSize = 8) =>
    http.get(
      `/vi-tri/phan-trang-tim-kiem?pageIndex=1&pageSize=8&keyword=${tinhThanh}`
    ),
  findViTri: (tinhThanh, pageIndex = 1, pageSize = 8) =>
    http.get(
      `/vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${tinhThanh}`
    ),
  getViTriInfo: (id) => http.get(`/vi-tri/${id}`),
  editViTri: (viTriData, tokenBearer) =>
    http.put(`/vi-tri`, viTriData, {
      headers: { token: tokenBearer },
    }),
};
