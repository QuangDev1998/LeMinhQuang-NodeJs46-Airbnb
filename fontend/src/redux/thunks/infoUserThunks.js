import { createAsyncThunk } from "@reduxjs/toolkit";
import { bookingServices } from "../../services/bookingServices";
import { phongServices } from "../../services/phongServices";
import { nguoiDungServices } from "../../services/nguoiDungServices";

export const fetchInfoUserAction = createAsyncThunk(
  "infoUserSlice/fetchInfoUserAction",
  async (id) => {
    const result = await nguoiDungServices.getUserInfo(id);
    return result.data.content;
  }
);
export const createListIdBookingAction = createAsyncThunk(
  "infoUserSlice/createListIdBooking",
  async (idUser) => {
    const listIdBookingClone = [];
    const result = await bookingServices.searchBooking(idUser);
    const bookingArr = result.data.content;
    for (let i = 0; i < bookingArr.length; i++) {
      listIdBookingClone.push(bookingArr[i].ma_phong);
    }
    return {
      listId: listIdBookingClone,
      listBooked: bookingArr,
    };
  }
);

export const createListBookedRoomAction = createAsyncThunk(
  "infoUserSlice/createListBookedRoom",
  async (listId) => {
    const listBookedRoomClone = [];
    const result = await phongServices.getListPhong();
    const listPhong = result.data.content;

    console.log("Danh sách ID phòng đã book:", listId);
    console.log("Tổng số phòng từ API:", listPhong.length);

    for (let id of listId) {
      const found = listPhong.find((phong) => phong.id === Number(id));
      if (found) listBookedRoomClone.push(found);
    }

    console.log("Danh sách phòng đã khớp:", listBookedRoomClone);

    return listBookedRoomClone;
  }
);
