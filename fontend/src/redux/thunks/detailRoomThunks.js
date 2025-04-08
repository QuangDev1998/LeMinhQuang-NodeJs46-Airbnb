import { createAsyncThunk } from "@reduxjs/toolkit";
import { phongServices } from "../../services/phongServices";
import { binhLuanServices } from "../../services/binhLuanServices";

export const fetchDetailRoomAction = createAsyncThunk(
  "detailRoomSlice/fetchDetailRoomAction",
  async (id) => {
    const result = await phongServices.getPhongInfo(id);
    return result.data;
  }
);

export const fetchListCommentByIdRoomAction = createAsyncThunk(
  "detailRoomSlice/fetchListCommentAction",
  async (id) => {
    const result = await binhLuanServices.getListCommentByIdRoom(id);
    return result.data?.content || [];
  }
);
