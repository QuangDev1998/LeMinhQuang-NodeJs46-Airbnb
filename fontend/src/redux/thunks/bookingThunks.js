import { createAsyncThunk } from "@reduxjs/toolkit";
import { bookingServices } from "../../services/bookingServices";

export const getListIdBookingAction = createAsyncThunk(
  "bookingSlice/getListIdBookingAction",
  async (idUser) => {
    // dùng id user để lấy list phòng đã book => set localStorage
    const result = await bookingServices.searchBooking(idUser);
    const bookingData = result.data.content;
    // tạo array chứa id phòng đã book
    let listIdBookingClone = [];
    for (let i = 0; i < bookingData.length; i++) {
      listIdBookingClone.push(bookingData[i].maPhong);
    }
    let listIdBookingJson = JSON.stringify(listIdBookingClone);
    localStorage.setItem("LIST_ID_BOOKING", listIdBookingJson);
    return listIdBookingClone;
  }
);

export const checkIsBookedAction = createAsyncThunk(
  "bookingSlice/checkIsBookedAction",
  async ({ listIdBooking, idRoom }) => {
    let index = listIdBooking.findIndex((id) => id === idRoom);
    if (index !== -1) {
      return true;
    }
    return false;
  }
);
