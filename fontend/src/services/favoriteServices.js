import { http } from "./config";

export const favoriteServices = {
  // Bật/tắt yêu thích 1 phòng
  toggle: (maPhong) => http.post(`/yeu-thich/toggle`, { maPhong }),

  // Danh sách phòng đã yêu thích (đầy đủ thông tin)
  getMyFavorites: () => http.get(`/yeu-thich`),

  // Danh sách id phòng đã yêu thích
  getMyFavoriteIds: () => http.get(`/yeu-thich/ids`),
};
