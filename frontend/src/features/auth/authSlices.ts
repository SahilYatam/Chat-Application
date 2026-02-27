import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoadingState, User } from "../../types";
import { authThunks } from "./authThunks";
import { userThunks } from "../user/userThunks";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: LoadingState;
  error: string | null;
  isAuthenticated: boolean | null;
  socketReady: boolean;
}
const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "idle",
  error: null,
  isAuthenticated: null,
  socketReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.status = "idle";
    },

    setSocketReady: (state) => {
      state.socketReady = true;
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(authThunks.signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(authThunks.signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(authThunks.signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Signup failed";
        state.isAuthenticated = false;
      })

      // Login
      .addCase(authThunks.loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(authThunks.loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(authThunks.loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(authThunks.logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      .addCase(userThunks.getUserProfile.pending, (state) => {
        state.status = "loading";
      })

      .addCase(userThunks.getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload as unknown as User;
        state.isAuthenticated = true;
        state.status = "succeeded";
      })

      .addCase(userThunks.getUserProfile.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "succeeded"; // IMPORTANT
      });
  },
});

export const { logout, setSocketReady, setAccessToken, clearError } =
  authSlice.actions;
export default authSlice.reducer;
