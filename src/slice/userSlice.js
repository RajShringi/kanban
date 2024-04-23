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

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          email: "jon@gmail.com",
          password: "12345",
        },
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
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log(action);
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state, action) => {},
    signup: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
  },
});

export const { login, logout, singup } = userSlice.actions;
export default userSlice.reducer;
