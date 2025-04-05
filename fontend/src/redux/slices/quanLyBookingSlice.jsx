import { createSlice } from "@reduxjs/toolkit";

import {
  fetchListBookingAction,
  fetchBookingInfoAction,
} from "../thunks/quanLyBookingThunks";

const initialState = {
  listBooking: [],
  bookingInfo: null,

  isModalEditOpen: false,
};

const quanLyBookingSlice = createSlice({
  name: "quanLyBookingSlice",
  initialState,
  reducers: {
    setListBookingAction: (state, action) => {
      state.listBooking = action.payload;
    },

    setIsModalEditOpenAction: (state, action) => {
      state.isModalEditOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchListBookingAction
    builder.addCase(fetchListBookingAction.fulfilled, (state, action) => {
      state.listBooking = action.payload;
    });
    builder.addCase(fetchListBookingAction.rejected, (state, action) => {
      console.error(action.error);
    });
    // fetchBookingInfoAction
    builder.addCase(fetchBookingInfoAction.fulfilled, (state, action) => {
      state.bookingInfo = action.payload;
    });
    builder.addCase(fetchBookingInfoAction.rejected, (state, action) => {
      console.error(action.error);
    });
  },
});

export const { setListBookingAction, setIsModalEditOpenAction } =
  quanLyBookingSlice.actions;

export default quanLyBookingSlice.reducer;
