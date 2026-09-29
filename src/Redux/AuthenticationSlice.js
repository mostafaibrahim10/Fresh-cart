import { createSlice } from "@reduxjs/toolkit";

export function saveAuthToStorage({ user, token }) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
}

export function clearAuthFromStorage() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

const AuthenticationSlice = createSlice({
  name: "authentication",

  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,

    token: localStorage.getItem("token"),
  },

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
