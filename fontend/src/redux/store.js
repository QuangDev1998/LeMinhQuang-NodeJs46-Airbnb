import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import quanLySoLieuSlice from "./slices/quanLySoLieuSlice";
import quanLyNguoiDungSlice from "./slices/quanLyNguoiDungSlice";
import quanLyViTriSlice from "./slices/quanLyViTriSlice";
import quanLyPhongSlice from "./slices/quanLyPhongSlice";
import quanLyBookingSlice from "./slices/quanLyBookingSlice";
import infoUserSlice from "./slices/infoUserSlice";
import detailRoomSlice from "./slices/detailRoomSlice";
import bookingSlice from "./slices/bookingSlice";
import spinnerSlice from "./slices/spinnerSlice";
import darkModeSlice from "./slices/darkModeSlice";

export const store = configureStore({
  reducer: {
    userSlice,
    quanLySoLieuSlice,
    quanLyNguoiDungSlice,
    quanLyViTriSlice,
    quanLyPhongSlice,
    quanLyBookingSlice,
    infoUserSlice,
    detailRoomSlice,
    bookingSlice,
    spinnerSlice,
    darkModeSlice,
  },
});
