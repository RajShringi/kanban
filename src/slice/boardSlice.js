import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
  activeBoard: {},
};

export const fetchBoards = createAsyncThunk(
  "board/fetchBoards",
  async (_, { getState }) => {
    try {
      const state = getState();
      const token = state.user.user.token;
      const res = await fetch("http://localhost:3000/api/boards/allboards", {
        method: "GET",
        headers: { authorization: `Token ${token}` },
      });
      const json = await res.json();
      return json;
    } catch (error) {
      return error;
    }
  }
);

export const fetchColumns = createAsyncThunk(
  "board/fetchColumns",
  async (columns, { getState }) => {
    console.log("fetch column called");
    try {
      const state = getState();
      const token = state.user.user.token;
      const promise = columns.map(async (columnId) => {
        const res = await fetch(
          `http://localhost:3000/api/columns/${columnId}`,
          {
            method: "GET",
            headers: { authorization: `Token ${token}` },
          }
        );
        const json = await res.json();
        return json;
      });
      console.log(promise);
      const result = await Promise.all(promise);
      return result;
    } catch (error) {
      return error;
    }
  }
);

export const postNewTask = createAsyncThunk(
  "board/postNewTask",
  async (newTask, { getState }) => {
    try {
      const state = getState();
      const token = state.user.user.token;
      const res = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          task: newTask,
        }),
      });
      const json = await res.json();
      return json.task;
    } catch (error) {
      return error;
    }
  }
);

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    selectBoard: (state, action) => {
      // console.log(action.payload);
      const { _id, name, columns } = action.payload;
      const board = { _id, name };
      state.activeBoard = board;
      localStorage.setItem("board", JSON.stringify(action.payload));
    },
    createNewtask: (state, action) => {
      const { column } = action.payload.task;
      state.activeBoard.columns = state.activeBoard.columns.map((col) => {
        if (col._id === column) {
          col.tasks.push({ _id: nanoid(), ...action.payload.task });
          col.tasks[col.tasks.length - 1].subTasks = col.tasks[
            col.tasks.length - 1
          ].subTasks.map((subTask) => {
            return { _id: nanoid(), name: subTask, isDone: false };
          });
        }
        return col;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoards.fulfilled, (state, action) => {
      state.boards = action.payload.boards;
    });

    builder.addCase(fetchColumns.fulfilled, (state, action) => {
      state.activeBoard.columns = action.payload;
    });

    builder.addCase(postNewTask.fulfilled, (state, action) => {
      console.log({ action }, "action");
      console.log("update task id");
      const { column, _id } = action.payload;
      console.log({ column, _id });
      state.activeBoard.columns = state.activeBoard.columns.map((col) => {
        if (col._id === column) {
          // replace actual with null in task
          col.tasks[col.tasks.length - 1]._id = _id;
        }
        return col;
      });
      console.log(state.activeBoard.columns);
      console.log("id is changed");
    });

    builder.addCase(postNewTask.rejected, (state, action) => {
      //handle error;
    });
  },
});

export const { selectBoard, createNewtask, updateTaskId } = boardSlice.actions;
export default boardSlice.reducer;
