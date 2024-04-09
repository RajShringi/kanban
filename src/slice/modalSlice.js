import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCreateBoardModalVisible: false,
  isEditBoardModalVisible: false,
  iscreateTaskModalVisible: false,
  isEditTaskModalVisible: false,
  isHeaderTooltipVisible: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    open: (state, action) => {
      if (action.payload.modal === "createBoard") {
        state.isCreateBoardModalVisible = true;
      }
      if (action.payload.modal === "editBoard") {
        state.isEditBoardModalVisible = true;
      }
      if (action.payload.modal === "createTask") {
        state.iscreateTaskModalVisible = true;
      }
      if (action.payload.tooltip === "header") {
        state.isHeaderTooltipVisible = true;
      }
    },

    close: (state, action) => {
      if (action.payload.modal === "createBoard") {
        state.isCreateBoardModalVisible = false;
      }
      if (action.payload.modal === "editBoard") {
        state.isEditBoardModalVisible = false;
      }
      if (action.payload.modal === "createTask") {
        state.iscreateTaskModalVisible = false;
      }
      if (action.payload.tooltip === "header") {
        state.isHeaderTooltipVisible = false;
      }
    },
  },
});

export const { open, close } = modalSlice.actions;
export default modalSlice.reducer;
