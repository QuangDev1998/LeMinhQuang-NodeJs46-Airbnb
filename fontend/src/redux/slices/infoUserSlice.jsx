import { createSlice } from "@reduxjs/toolkit";
import {
  createListBookedRoomAction,
  createListIdBookingAction,
  fetchInfoUserAction,
} from "../thunks/infoUserThunks";

const initialState = {
  infoUser: {},
  listBooked: [], // list phòng đã đặt
  listIdBooking: [], // list id phòng
  listBookedRoom: [], // list thông tin phòng đã đặt
  isModalUpHinhOpen: false,
  isModalEditOpen: false,
};

const infoUserSlice = createSlice({
  name: "infoUserSlice",
  initialState,
  reducers: {
    setInfoUserAction: (state, action) => {
      state.infoUser = action.payload;
    },
    setListBookedAction: (state, action) => {
      state.listBooked = action.payload;
    },
    setListIDBookingAction: (state, action) => {
      state.listIdBooking = action.payload;
    },
    setListBookedRoomAction: (state, action) => {
      state.listBookedRoom = action.payload;
    },
    setIsModalUpHinhOpenAction: (state, action) => {
      state.isModalUpHinhOpen = action.payload;
    },
    setIsModalEditOpenAction: (state, action) => {
      state.isModalEditOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchInfoUserAction
    builder.addCase(fetchInfoUserAction.fulfilled, (state, action) => {
      state.infoUser = action.payload;
    });
    builder.addCase(fetchInfoUserAction.rejected, (state, action) => {
      console.error(action.error);
    });
    // createListIdBookingAction
    builder.addCase(createListIdBookingAction.fulfilled, (state, action) => {
      state.listIdBooking = action.payload.listId;
      state.listBooked = action.payload.listBooked;
    });
    builder.addCase(createListIdBookingAction.rejected, (state, action) => {
      console.error(action.error);
    });
    // createListIdBookingAction
    builder.addCase(createListBookedRoomAction.fulfilled, (state, action) => {
      state.listBookedRoom = action.payload;
    });
    builder.addCase(createListBookedRoomAction.rejected, (state, action) => {
      console.error(action.error);
    });
  },
});

export const {
  setInfoUserAction,
  setListBookedAction,
  setListIDBookingAction,
  setListBookedRoomAction,
  setIsModalUpHinhOpenAction,
  setIsModalEditOpenAction,
} = infoUserSlice.actions;

export default infoUserSlice.reducer;
