import { createAsyncThunk } from "@reduxjs/toolkit";
import { viTriServices } from "../../services/viTriServices";
export const fetchListViTriAction = createAsyncThunk(
  "quanLyViTriSlice/fetchListViTriAction",
  async ({ currentPage, valueInput }) => {
    const result = await viTriServices.findViTri2(currentPage, 3, valueInput);
    return result.data.content;
  }
);

export const fetchViTriInfoAction = createAsyncThunk(
  "quanLyViTriSlice/fetchViTriInfoAction",
  async (id) => {
    const result = await viTriServices.getViTriInfo(id);
    return result.data.content;
  }
);
