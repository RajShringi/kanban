import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isBoardModalVisible: false,
  isTaskModalVisible: false,
  isHeaderTooltipVisible: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    open: (state, action) => {
      if (action.payload.modal === "board") {
        state.isBoardModalVisible = true;
      }
      if (action.payload.modal === "task") {
        state.isTaskModalVisible = true;
      }
      if (action.payload.tooltip === "header") {
        state.isHeaderTooltipVisible = true;
      }
    },

    close: (state, action) => {
      if (action.payload.modal === "board") {
        state.isBoardModalVisible = false;
      }
      if (action.payload.modal === "task") {
        state.isTaskModalVisible = false;
      }
      if (action.payload.tooltip === "header") {
        state.isHeaderTooltipVisible = false;
      }
    },
  },
});

export const { open, close } = modalSlice.actions;
export default modalSlice.reducer;
