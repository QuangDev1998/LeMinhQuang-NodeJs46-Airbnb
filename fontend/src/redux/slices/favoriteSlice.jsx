import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { favoriteServices } from "../../services/favoriteServices";

// Lấy danh sách id phòng đã yêu thích của user hiện tại
export const fetchFavoriteIdsAction = createAsyncThunk(
  "favoriteSlice/fetchIds",
  async () => {
    const res = await favoriteServices.getMyFavoriteIds();
    return res.data?.content || [];
  }
);

// Bật/tắt yêu thích 1 phòng -> trả về { maPhong, favorited }
export const toggleFavoriteAction = createAsyncThunk(
  "favoriteSlice/toggle",
  async (maPhong) => {
    const res = await favoriteServices.toggle(maPhong);
    return res.data?.content;
  }
);

const initialState = {
  favoriteIds: [], // mảng id phòng đã thích
};

const favoriteSlice = createSlice({
  name: "favoriteSlice",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favoriteIds = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFavoriteIdsAction.fulfilled, (state, action) => {
      state.favoriteIds = action.payload;
    });
    builder.addCase(toggleFavoriteAction.fulfilled, (state, action) => {
      const { maPhong, favorited } = action.payload || {};
      if (favorited) {
        if (!state.favoriteIds.includes(maPhong))
          state.favoriteIds.push(maPhong);
      } else {
        state.favoriteIds = state.favoriteIds.filter((id) => id !== maPhong);
      }
    });
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
