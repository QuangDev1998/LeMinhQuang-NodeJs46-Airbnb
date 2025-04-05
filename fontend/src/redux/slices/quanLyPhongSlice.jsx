import { createSlice } from "@reduxjs/toolkit";
import {
  fetchListPhongAction,
  fetchPhongInfoAction,
} from "../thunks/quanLyPhongThunks";

const initialState = {
  listPhong: [],
  phongInfo: null,
  isModalOpen: false,
  isModalEditOpen: false,
  totalRow: null,
  currentPage: 1,
};

const quanLyPhongSlice = createSlice({
  name: "quanLyPhongSlice",
  initialState,
  reducers: {
    setListPhongAction: (state, action) => {
      state.listPhong = action.payload;
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
    // fetchListPhongAction
    builder.addCase(fetchListPhongAction.fulfilled, (state, action) => {
      state.listPhong = action.payload.data;
      state.totalRow = action.payload.totalRow;
      state.currentPage = action.payload.pageIndex;
    });
    builder.addCase(fetchListPhongAction.rejected, (state, action) => {
      console.error(action.error);
    });
    // fetchPhongInfoAction
    builder.addCase(fetchPhongInfoAction.fulfilled, (state, action) => {
      state.phongInfo = action.payload;
    });
    builder.addCase(fetchPhongInfoAction.rejected, (state, action) => {
      console.error(action.error);
    });
  },
});

export const {
  setListPhongAction,
  setIsModalOpenAction,
  setIsModalEditOpenAction,
  setTotalRowAction,
  setCurrentPageAction,
} = quanLyPhongSlice.actions;

export default quanLyPhongSlice.reducer;
