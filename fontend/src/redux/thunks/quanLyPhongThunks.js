import { createAsyncThunk } from "@reduxjs/toolkit";
import { phongServices } from "../../services/phongServices";

// Tìm kiếm và phân trang danh sách phòng
export const fetchListPhongAction = createAsyncThunk(
  "quanLyPhongSlice/fetchListPhongAction",
  async ({ currentPage, valueInput }) => {
    const result = await phongServices.findPhong(currentPage, 10, valueInput);
    return result.data.content; // ← Trả về object chứa { data, totalRow, pageIndex }
  }
);

// Lấy chi tiết phòng
export const fetchPhongInfoAction = createAsyncThunk(
  "quanLyPhongSlice/fetchPhongInfoAction",
  async (id) => {
    const result = await phongServices.getPhongInfo(id);
    return result.data.content;
  }
);
