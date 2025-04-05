import { createSlice } from "@reduxjs/toolkit";
let themeModeJson = localStorage.getItem("themeMode");

const initialState = {
  themeMode: themeModeJson ? themeModeJson : "light",
};

const darkModeSlice = createSlice({
  name: "darkModeSlice",
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
      localStorage.setItem("themeMode", action.payload);
    },
  },
});

export const { setThemeMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
