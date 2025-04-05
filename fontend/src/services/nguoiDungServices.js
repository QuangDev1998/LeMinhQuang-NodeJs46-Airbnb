import { http } from "./config";

export const nguoiDungServices = {
  getListUser: () => http.get(`/users`),
  searchUser: (keyword) => http.get(`/users/search/${keyword}`),
  deleteUser: (id) => http.delete(`/users?id=${id}`),
  getUserInfo: (id) => http.get(`/users/${id}`),
  createUser: (user) => http.post(`/users`, user),
  findUser: (pageIndex, pageSize, keyword) =>
    http.get(
      `/users/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
    ),

  editUser: (id, userInfo) => http.put(`/users/${id}`, userInfo),
  uploadHinhUser: (formFile, tokenBearer) =>
    http.post(`/users/upload-avatar`, formFile, {
      headers: { token: tokenBearer },
    }),
};
