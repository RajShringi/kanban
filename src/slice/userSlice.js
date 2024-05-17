import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: false,
};

const user = JSON.parse(localStorage.getItem("user")) || "";
if (user) {
  initialState.user = user;
}

export const userRegister = createAsyncThunk(
  "user/userRegister",
  async (userInfo) => {
    try {
      const res = await fetch("http://localhost:3000/api/signup", {
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
        return;
      }
      const json = await res.json();
      return json;
    } catch (error) {
      return error;
    }
  }
);

export const userLogin = createAsyncThunk(
  "user/userLogin",
  async (userInfo) => {
    try {
      const res = await fetch("http://localhost:3000/api/login", {
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
        return;
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
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(userRegister.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
  },
});

export const { login, logout, singup } = userSlice.actions;
export default userSlice.reducer;
