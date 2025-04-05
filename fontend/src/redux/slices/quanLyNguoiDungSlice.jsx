import { createSlice } from "@reduxjs/toolkit";
import {
  fetchListUserAction,
  fetchUserInfoAction,
} from "../thunks/quanLyNguoiDungThunks";

const initialState = {
  listUser: [],
  userInfo: null,
  isModalOpen: false,
  isModalEditOpen: false,
  totalRow: null,
  currentPage: 1,
};

const quanLyNguoiDungSlice = createSlice({
  name: "quanLyNguoiDungSlice",
  initialState,
  reducers: {
    setListUserAction: (state, action) => {
      state.listUser = action.payload;
    },
    setIsModalOpenAction: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setIsModalEditOpenAction: (state, action) => {
      state.isModalEditOpen = action.payload;
    },
    setTotalRowAction: (state, action) => {
      state.totalRow = action.payload;
    },
    setCurrentPageAction: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchListUserAction
    builder.addCase(fetchListUserAction.fulfilled, (state, action) => {
      state.listUser = action.payload.data;
      state.totalRow = action.payload.totalRow;
      state.currentPage = action.payload.pageIndex;
    });
    builder.addCase(fetchListUserAction.rejected, (state, action) => {
      console.error(action.error);
    });
    // fetchUserInfoAction
    builder.addCase(fetchUserInfoAction.fulfilled, (state, action) => {
      state.userInfo = action.payload;
    });
    builder.addCase(fetchUserInfoAction.rejected, (state, action) => {
      console.error(action.error);
    });
  },
});

export const {
  setListUserAction,
  setIsModalOpenAction,
  setIsModalEditOpenAction,
  setTotalRowAction,
  setCurrentPageAction,
} = quanLyNguoiDungSlice.actions;

export default quanLyNguoiDungSlice.reducer;
