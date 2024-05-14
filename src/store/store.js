import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../slice/modalSlice";
import userReducer from "../slice/userSlice";
import boardReducer from "../slice/boardSlice";
import themeReducer from "../slice/themeSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer,
    board: boardReducer,
    theme: themeReducer,
  },
});
