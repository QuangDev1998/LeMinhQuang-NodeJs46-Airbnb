import { createSlice } from "@reduxjs/toolkit";
import { addDays } from "date-fns";
import {
  getListIdBookingAction,
  checkIsBookedAction,
} from "../thunks/bookingThunks";

let listIdBookingJson = localStorage.getItem("LIST_ID_BOOKING");

const initialState = {
  listIdBooking: listIdBookingJson ? JSON.parse(listIdBookingJson) : null,
  isBooked: false,
  totalDay: 7,
  ngayDen: new Date(),
  ngayDi: addDays(new Date(), 7),
  soLuongKhach: 1,
  tienTruocThue: null,
  isModalCalendarOpen: false,
  isModalPaymentOpen: false,
  isModalReBookingOpen: false,
};

const bookingSlice = createSlice({
  name: "bookingSlice",
  initialState,
  reducers: {
    setListIdBooking: (state, action) => {
      state.listIdBooking = action.payload;
    },
    setIsBooked: (state, action) => {
      state.isBooked = action.payload;
    },
    setIsModalCalendarOpen: (state, action) => {
      state.isModalCalendarOpen = action.payload;
    },
    setTotalDay: (state, action) => {
      state.totalDay = action.payload;
    },
    setTienTruocThue: (state, action) => {
      state.tienTruocThue = action.payload;
    },
    setSoLuongKhach: (state, action) => {
      state.soLuongKhach = action.payload;
    },
    setNgayDen: (state, action) => {
      state.ngayDen = action.payload;
    },
    setNgayDi: (state, action) => {
      state.ngayDi = action.payload;
    },
    setIsModalPaymentOpen: (state, action) => {
      state.isModalPaymentOpen = action.payload;
    },
    setIsModalReBookingOpen: (state, action) => {
      state.isModalReBookingOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    // getListIdBookingAction
    builder.addCase(getListIdBookingAction.fulfilled, (state, action) => {
      state.listIdBooking = action.payload;
    });
    builder.addCase(getListIdBookingAction.rejected, (state, action) => {
      console.error(action.error);
    });
    // checkIsBookedAction
    builder.addCase(checkIsBookedAction.fulfilled, (state, action) => {
      state.isBooked = action.payload;
    });
    builder.addCase(checkIsBookedAction.rejected, (state, action) => {
      console.error(action.error);
    });
  },
});

export const {
  setListIdBooking,
  setIsBooked,
  setIsModalCalendarOpen,
  setTotalDay,
  setTienTruocThue,
  setSoLuongKhach,
  setNgayDen,
  setNgayDi,
  setIsModalPaymentOpen,
  setIsModalReBookingOpen,
} = bookingSlice.actions;

export default bookingSlice.reducer;
