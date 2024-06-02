import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginURL, signupURL } from "../utils/constant";

const initialState = {
  user: null,
  loading: false,
  error: false,
  errMsg: {},
};

const user = JSON.parse(localStorage.getItem("user")) || "";
if (user) {
  initialState.user = user;
}

export const userRegister = createAsyncThunk(
  "user/userRegister",
  async (userInfo, { rejectWithValue }) => {
    try {
      const res = await fetch(signupURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userInfo,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        return rejectWithValue(json.errMsg);
      }
      const json = await res.json();
      return json;
    } catch (error) {
      return rejectWithValue(error.errMsg);
    }
  }
);

export const userLogin = createAsyncThunk(
  "user/userLogin",
  async (userInfo, { rejectWithValue }) => {
    try {
      const res = await fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userInfo,
        }),
      });
      if (!res.ok) {
        console.log("response is not okay while fetching user");
        const json = await res.json();
        return rejectWithValue(json.errMsg);
      }
      const json = await res.json();
      return json;
    } catch (error) {
      return error;
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      const getCurrentTheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      state.user = null;
      localStorage.setItem("user", null);
      localStorage.setItem("board", null);
      localStorage.setItem("theme", getCurrentTheme() ? "dark" : "light");
    },
    signup: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    resetError: (state, action) => {
      state.errMsg = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.user = action.payload;
      state.errMsg = {};
      state.loading = false;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.errMsg = {};
      if (action.payload === "password is incorrect") {
        state.errMsg.password = "password is incorrect";
      }
      if (action.payload === "User not found") {
        state.errMsg.email = "Email is not found";
      }
      state.errMsg.err = action.payload;
      state.loading = false;
    });
    builder.addCase(userRegister.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(userRegister.fulfilled, (state, action) => {
      state.user = action.payload;
      state.errMsg = {};
      state.loading = false;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(userRegister.rejected, (state, action) => {
      state.errMsg = {};
      if (action.payload === "User with this email already exist") {
        state.errMsg.email = "User with this email already exist";
      }
      if (action.payload === "User with this username already exist") {
        state.errMsg.username = "User with this username already exist";
      }
      state.errMsg.err = action.payload;
      state.loading = false;
    });
  },
});

export const { login, logout, singup, resetError } = userSlice.actions;
export default userSlice.reducer;
