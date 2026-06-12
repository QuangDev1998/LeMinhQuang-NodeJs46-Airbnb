import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Đếm số request đang chạy để nhiều request song song không tắt loading sớm
  pending: 0,
  isLoading: false,
};

const spinnerSlice = createSlice({
  name: "spinnerSlice",
  initialState,
  reducers: {
    turnOnLoading: (state) => {
      state.pending += 1;
      state.isLoading = true;
    },
    turnOffLoading: (state) => {
      state.pending = Math.max(0, state.pending - 1);
      state.isLoading = state.pending > 0;
    },
  },
});

export const { turnOnLoading, turnOffLoading } = spinnerSlice.actions;

export default spinnerSlice.reducer;
