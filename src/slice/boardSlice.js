import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
  activeBoard: {},
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    createBoard: (state, action) => {},
    deleteBoard: (state, action) => {},
    updateBoard: (state, action) => {},
    createTask: (state, action) => {},
    udpateTask: (state, action) => {},
    updateSubTaskIsDone: (state, action) => {},
  },
});
