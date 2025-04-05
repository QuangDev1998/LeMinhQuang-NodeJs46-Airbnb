import { createAsyncThunk } from "@reduxjs/toolkit";
import { bookingServices } from "../../services/bookingServices";

export const fetchListBookingAction = createAsyncThunk(
  "quanLyBookingSlice/fetchListBookingAction",
  async () => {
    const result = await bookingServices.getListBooking();
    return result.data.content;
  }
);

export const fetchBookingInfoAction = createAsyncThunk(
  "quanLyBookingSlice/fetchBookingInfoAction",
  async (bookingId) => {
    const result = await bookingServices.getBookingInfo(bookingId);
    return result.data.content;
  }
);
