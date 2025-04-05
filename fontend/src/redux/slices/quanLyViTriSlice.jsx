import { createSlice } from "@reduxjs/toolkit";
import {
  fetchListViTriAction,
  fetchViTriInfoAction,
} from "../thunks/quanLyViTriThunks";

const initialState = {
  listViTri: [],
  viTriInfo: null,
  isModalOpen: false,
  isModalEditOpen: false,
  totalRow: null,
  currentPage: 1,
};

const quanLyViTriSlice = createSlice({
  name: "quanLyViTriSlice",
  initialState,
  reducers: {
    setListViTriAction: (state, action) => {
      state.listViTri = action.payload;
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
    // fetchListViTriAction
    builder.addCase(fetchListViTriAction.fulfilled, (state, action) => {
      state.listViTri = action.payload.data;
      state.totalRow = action.payload.totalRow;
      state.currentPage = action.payload.pageIndex;
    });
    builder.addCase(fetchListViTriAction.rejected, (state, action) => {
      console.error(action.error);
    });
    // fetchViTriInfoAction
    builder.addCase(fetchViTriInfoAction.fulfilled, (state, action) => {
      state.viTriInfo = action.payload;
    });
    builder.addCase(fetchViTriInfoAction.rejected, (state, action) => {
      console.error(action.error);
    });
  },
});

export const {
  setListViTriAction,
  setIsModalOpenAction,
  setIsModalEditOpenAction,
  setTotalRowAction,
  setCurrentPageAction,
} = quanLyViTriSlice.actions;

export default quanLyViTriSlice.reducer;
