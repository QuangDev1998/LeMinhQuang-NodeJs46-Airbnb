import { http } from "./config";

export const binhLuanServices = {
  getListComment: () => http.get(`/binh-luan`),
  getListCommentByIdRoom: (maPhong) =>
    http.get(`/binh-luan/lay-binh-luan-theo-phong/${maPhong}`),
  addComment: (token, form) =>
    http.post(`/binh-luan`, form, { headers: { token } }),
};
