import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import {
  createNewTaskURL,
  ROOT_URL,
  fetchBoardsURL,
  changeTaskColumnURL,
  createNewBoardURL,
  moveTaskURL,
} from "../utils/constant";

const initialState = {
  boards: [],
  activeBoard: {},
  selectedTask: "",
};

export const fetchBoards = createAsyncThunk(
  "board/fetchBoards",
  async (_, { getState }) => {
    try {
      const state = getState();
      const token = state.user.user.token;
      const res = await fetch(fetchBoardsURL, {
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
  async (columns, { getState, rejectWithValue }) => {
    console.log({ columns }, "fetchcolums req");
    try {
      const state = getState();
      const token = state.user.user.token;
      if (!columns) {
        return;
      }
      const promise = columns.map(async (columnId) => {
        const res = await fetch(`${ROOT_URL}/columns/${columnId}`, {
          method: "GET",
          headers: { authorization: `Token ${token}` },
        });
        if (!res.ok) {
          throw new Error("No column found with this ${columnId}");
        }
        const json = await res.json();
        return json;
      });
      const result = await Promise.all(promise);
      return result;
    } catch (error) {
      return rejectWithValue(error);
      return error;
    }
  }
);

export const postNewTask = createAsyncThunk(
  "board/postNewTask",
  async (taskInfo, { getState }) => {
    try {
      const state = getState();
      const token = state.user.user.token;
      const res = await fetch(createNewTaskURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          task: taskInfo.newTask,
        }),
      });
      const json = await res.json();
      return { task: json.task, reduxTaskId: taskInfo.reduxTaskId };
    } catch (error) {
      return error;
    }
  }
);

export const postChangeIsDone = createAsyncThunk(
  "board/postChangeIsDone",
  async (subTask, { getState }) => {
    const state = getState();
    const token = state.user.user.token;
    try {
      const res = await fetch(`${ROOT_URL}/subTasks/${subTask.subTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          subTask: {
            isDone: subTask.isDone,
          },
        }),
      });
      const json = await res.json();
      return json.subTask;
    } catch (error) {
      return error;
    }
  }
);

export const changeTaskColumn = createAsyncThunk(
  "board/changeTaskColumn",
  async (moveColumnId, { getState }) => {
    const state = getState();
    const token = state.user.user.token;
    const { columnIndex, taskIndex } = state.board.selectedTask;
    const taskToMove =
      state.board.activeBoard.columns[columnIndex].tasks[taskIndex];

    try {
      const res = await fetch(changeTaskColumnURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          task: {
            taskId: taskToMove._id,
            currentColumn: taskToMove.column,
            moveColumn: moveColumnId,
          },
        }),
      });
      const json = await res.json();

      return json;
    } catch (error) {
      return error;
    }
  }
);

export const deleteTaskReq = createAsyncThunk(
  "board/deleteTaskReq",
  async (taskId, { getState }) => {
    const state = getState();
    const token = state.user.user.token;
    try {
      const res = await fetch(`${ROOT_URL}/tasks/${taskId}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
      });
      const json = await res.json();
      return json;
    } catch (error) {
      return error;
    }
  }
);

export const editTaskReq = createAsyncThunk(
  "board/editTaskReq",
  async (task, { getState }) => {
    const state = getState();
    const token = state.user.user.token;
    try {
      const res = await fetch(`${ROOT_URL}/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
        body: JSON.stringify({ task }),
      });
      const json = await res.json();
      return json;
    } catch (error) {
      return error;
    }
  }
);

export const createNewBoardReq = createAsyncThunk(
  "board/createNewBoardReq",
  async (board, { getState }) => {
    const state = getState();
    const token = state.user.user.token;
    try {
      const res = await fetch(createNewBoardURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
        body: JSON.stringify({ board }),
      });
      const json = await res.json();
      return json;
    } catch (error) {
      return error;
    }
  }
);

export const editBoardReq = createAsyncThunk(
  "board/editBoardReq",
  async (board, { getState }) => {
    const state = getState();
    const token = state.user.user.token;
    try {
      const res = await fetch(`${ROOT_URL}/boards/${board._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
        body: JSON.stringify({ board }),
      });
      const json = await res.json();
      return json;
    } catch (error) {
      return error;
    }
  }
);

export const deleteBoardReq = createAsyncThunk(
  "board/deleteBoard",
  async (deleteBoardId, { getState }) => {
    const state = getState();
    const token = state.user.user.token;
    try {
      const res = await fetch(`${ROOT_URL}/boards/${deleteBoardId}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
      });
      const json = await res.json();
      return json;
    } catch (error) {
      return error;
    }
  }
);

export const moveTaskReq = createAsyncThunk(
  "board/moveTaskReq",
  async (moveInfo, { getState }) => {
    const state = getState();
    const token = state.user.user.token;
    try {
      const res = await fetch(moveTaskURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${token}`,
        },
        body: JSON.stringify(moveInfo),
      });
      const json = await res.json();
      return json;
    } catch (error) {
      return error;
    }
  }
);

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    createBoard: (state, action) => {
      const board = action.payload;
      const newBoard = {
        _id: nanoid(),
        name: board.name,
        columns: board.columns.map((col) => ({
          _id: nanoid(),
          name: col,
          tasks: [],
        })),
      };
      // console.log({ newBoard, pyalod: action.payload }, "creaetboooooo");
      state.boards.push(newBoard);
      state.activeBoard = newBoard;
    },

    selectBoard: (state, action) => {
      let board = "";
      if (action.payload) {
        const { _id, name } = action.payload;
        board = { _id, name };
      }
      state.activeBoard = board;
      localStorage.setItem("board", JSON.stringify(action.payload));
    },

    createTask: (state, action) => {
      const { task } = action.payload;
      const activeBoard = JSON.parse(JSON.stringify(state.activeBoard));
      const newTask = {
        ...task,
        subTasks: task.subTasks.map((subTask) => {
          return { _id: nanoid(), name: subTask, isDone: false };
        }),
      };

      const columnIndex = activeBoard.columns.findIndex(
        (col) => col._id === newTask.column
      );
      if (columnIndex === -1) return state;
      state.activeBoard.columns[columnIndex].tasks.push(newTask);
    },

    selectTask: (state, action) => {
      const task = action.payload;
      const columnIndex = state.activeBoard.columns.findIndex(
        (col) => col._id === task.column
      );
      if (columnIndex === -1) return;

      const taskIndex = state.activeBoard.columns[columnIndex].tasks.findIndex(
        (t) => t._id === task._id
      );
      if (taskIndex === -1) return;

      state.selectedTask = { columnIndex, taskIndex };
    },

    changeIsDone: (state, action) => {
      const { isDone, subTaskId } = action.payload;
      const { columnIndex, taskIndex } = state.selectedTask;
      const subTaskIndex = state.activeBoard.columns[columnIndex].tasks[
        taskIndex
      ].subTasks.findIndex((subTask) => subTask._id === subTaskId);
      if (subTaskIndex === -1) return;

      state.activeBoard.columns[columnIndex].tasks[taskIndex].subTasks[
        subTaskIndex
      ].isDone = isDone;
    },

    changeStatusOfTask: (state, action) => {
      const { columnIndex, taskIndex } = state.selectedTask;
      const taskToMove =
        state.activeBoard.columns[columnIndex].tasks[taskIndex];
      // removing task from column
      state.activeBoard.columns[columnIndex].tasks = state.activeBoard.columns[
        columnIndex
      ].tasks.filter((task) => task._id !== taskToMove._id);

      const targetColumnIndex = state.activeBoard.columns.findIndex(
        (col) => col._id === action.payload
      );
      // add task in new column
      state.activeBoard.columns[targetColumnIndex].tasks.push({
        ...taskToMove,
        column: action.payload,
      });
    },

    editTask: (state, action) => {
      const { task } = action.payload;
      task.subTasks = task.subTasks.map((subTask) => {
        if (!subTask._id) {
          return { _id: nanoid(), ...subTask };
        }
        return subTask;
      });

      const moveColumnIndex = state.activeBoard.columns.findIndex(
        (col) => col._id === task.column
      );
      const { columnIndex, taskIndex } = state.selectedTask;
      if (moveColumnIndex === columnIndex) {
        // user didn't change the task column
        state.activeBoard.columns[columnIndex].tasks[taskIndex] = task;
        return;
      }
      //user change the task column
      // removing task from column
      state.activeBoard.columns[columnIndex].tasks = state.activeBoard.columns[
        columnIndex
      ].tasks.filter((t) => t._id !== task._id);
      // add task in new column
      state.activeBoard.columns[moveColumnIndex].tasks.push(task);
    },

    editBoard: (state, action) => {
      const { board } = action.payload;
      board.columns = board.columns.map((col) => {
        if (!col._id) {
          return { ...col, _id: nanoid(), tasks: [] };
        }
        return col;
      });

      state.activeBoard = board;
      const index = state.boards.findIndex((b) => b._id === board._id);
      state.boards[index].name = board.name;
      const columns = board.columns.map((col) => col._id);
      state.boards[index].columns = columns;
      localStorage.setItem("board", JSON.stringify(state.boards));
    },

    removeTask: (state, action) => {
      const { columnIndex } = state.selectedTask;
      const deleteTaskId = action.payload;
      state.activeBoard.columns[columnIndex].tasks = state.activeBoard.columns[
        columnIndex
      ].tasks.filter((t) => t._id !== deleteTaskId);
    },

    deleteBoard: (state, action) => {
      const deleteBoardId = action.payload;
      state.boards = state.boards.filter(
        (board) => board._id !== deleteBoardId
      );
      const board = state.boards[0] === undefined ? null : state.boards[0];
      localStorage.setItem("board", JSON.stringify(board));
    },

    moveTask: (state, action) => {
      const activeBoard = JSON.parse(JSON.stringify(state.activeBoard));
      const {
        taskId,
        destinationColumn,
        sourceColumn,
        dragIndex,
        destinationIndex,
      } = action.payload;
      const sourceColumnIndex = activeBoard.columns.findIndex(
        (col) => col._id === sourceColumn
      );

      const destinationColumnIndex = activeBoard.columns.findIndex(
        (col) => col._id === destinationColumn
      );

      if (sourceColumnIndex === -1) return;
      if (destinationColumnIndex === -1) return;

      const task = activeBoard.columns[sourceColumnIndex].tasks[dragIndex];
      task.column = destinationColumn;

      activeBoard.columns[sourceColumnIndex].tasks = activeBoard.columns[
        sourceColumnIndex
      ].tasks.filter((task) => task._id !== taskId);

      activeBoard.columns[destinationColumnIndex].tasks = [
        ...activeBoard.columns[destinationColumnIndex].tasks.slice(
          0,
          destinationIndex
        ),
        task,
        ...activeBoard.columns[destinationColumnIndex].tasks.slice(
          destinationIndex
        ),
      ];

      state.activeBoard = activeBoard;
    },

    boardLogout: (state, action) => {
      // state = { boards: [], activeBoard: {}, selectedTask: "" };
      state.boards = [];
      state.activeBoard = {};
      state.selectedTask = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoards.fulfilled, (state, action) => {
      state.boards = action.payload.boards;
      // localStorage.setItem("board", JSON.stringify(action.payload.boards[0]));
    });

    builder.addCase(fetchColumns.fulfilled, (state, action) => {
      if (action.payload) {
        console.log(action.payload, "fetchcolums");
        state.activeBoard.columns = action.payload;
      }
    });

    builder.addCase(fetchColumns.rejected, (state, action) => {
      console.log("coming here ");
      if (action.payload) {
        console.log(action.payload, "fetchcolums");
        state.activeBoard.columns = action.payload;
      }
    });

    builder.addCase(postNewTask.fulfilled, (state, action) => {
      const { task, reduxTaskId } = action.payload;
      const columnIndex = state.activeBoard.columns.findIndex(
        (col) => col._id === task.column
      );
      const taskIndex = state.activeBoard.columns[columnIndex].tasks.findIndex(
        (t) => t._id === reduxTaskId
      );
      state.activeBoard.columns[columnIndex].tasks[taskIndex] = task;
    });

    builder.addCase(postNewTask.rejected, (state, action) => {
      //handle error;
    });

    builder.addCase(postChangeIsDone.fulfilled, (state, action) => {
      console.log(action, "postChangeIsDone");
    });
    builder.addCase(changeTaskColumn.fulfilled, (state, action) => {
      console.log(action, "changeTaskColumn");
      state.selectedTask = "";
    });

    builder.addCase(deleteTaskReq.fulfilled, (state, action) => {
      console.log(action, "deleteTask Req");
      state.selectedTask = "";
    });

    builder.addCase(editBoardReq.fulfilled, (state, action) => {
      const board = action.payload.updatedBoard;
      const index = state.boards.findIndex(
        (b) => b._id === state.activeBoard._id
      );
      state.boards[index].columns = board.columns;
      localStorage.setItem(
        "board",
        JSON.stringify({
          _id: state.activeBoard._id,
          name: state.activeBoard.name,
          columns: board.columns,
        })
      );
      state.activeBoard.columns = state.activeBoard.columns.map((col, idx) => {
        if (col._id === board.columns[idx]) {
          return col;
        }
        return { ...col, _id: board.columns[idx] };
      });
    });

    builder.addCase(createNewBoardReq.fulfilled, (state, action) => {
      const board = action.payload.board;
      console.log({ board });
      state.boards[state.boards.length - 1] = {
        _id: board._id,
        name: board.name,
        columns: board.columns,
      };
      localStorage.setItem(
        "board",
        JSON.stringify({
          _id: board._id,
          name: board.name,
          columns: board.columns,
        })
      );
      state.activeBoard._id = board._id;
      console.log(
        state.activeBoard.columns.map((col) => {
          return { ...col };
        })
      );
      state.activeBoard.columns = state.activeBoard.columns.map((col, idx) => ({
        ...col,
        _id: board.columns[idx],
      }));
      console.log(board, "createnewboardreq");
    });

    builder.addCase(deleteBoardReq.fulfilled, (state, action) => {
      console.log(action.payload, "deleteBoardreq");
    });

    builder.addCase(moveTaskReq.fulfilled, (state, action) => {
      console.log("task moved successfully");
    });
  },
});

export const {
  selectBoard,
  createTask,
  selectTask,
  changeIsDone,
  changeStatusOfTask,
  editTask,
  editBoard,
  removeTask,
  createBoard,
  deleteBoard,
  moveTask,
  boardLogout,
} = boardSlice.actions;
export default boardSlice.reducer;
