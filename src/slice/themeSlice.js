import { createSlice } from "@reduxjs/toolkit";
const getCurrentTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const initialState = {
  theme: getCurrentTheme() ? "dark" : "light",
};

const theme = localStorage.getItem("theme") || "";
if (theme) {
  initialState.theme = theme;
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;
