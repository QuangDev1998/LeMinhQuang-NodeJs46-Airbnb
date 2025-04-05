import { createSlice } from "@reduxjs/toolkit";

// ✅ Bắt lỗi khi parse JSON
let parsedLoginData = null;
try {
  const raw = localStorage.getItem("USER_LOGIN");
  if (raw && raw !== "undefined") {
    parsedLoginData = JSON.parse(raw);
  }
} catch (err) {
  console.error("Lỗi JSON.parse USER_LOGIN:", err);
  localStorage.removeItem("USER_LOGIN"); // xoá để tránh lặp lại lỗi
}

const initialState = {
  loginData: parsedLoginData,
  isModalOpen: false,
  modalContent: "login",
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setLoginData: (state, action) => {
      state.loginData = action.payload;
      localStorage.setItem("USER_LOGIN", JSON.stringify(action.payload));
    },
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setModalContent: (state, action) => {
      state.modalContent = action.payload;
    },
  },
});

export const { setLoginData, setIsModalOpen, setModalContent } =
  userSlice.actions;

export default userSlice.reducer;
