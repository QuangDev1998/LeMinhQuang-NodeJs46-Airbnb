import { http } from "./config";

export const bookingServices = {
  getListBooking: () => http.get(`/dat-phong`),
  searchBooking: (maNguoiDung) =>
    http.get(`/dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`),
  deleteBooking: (id) => http.delete(`/dat-phong/${id}`),
  getBookingInfo: (id) => http.get(`/dat-phong/${id}`),
  createBooking: (booking) => http.post(`/dat-phong`, booking),
  editBooking: (id, bookingInfo) => http.put(`/dat-phong/${id}`, bookingInfo),
};
