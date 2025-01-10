// src/store/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
    refreshTokenSuccess: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, refreshTokenSuccess } = authSlice.actions;
export default authSlice.reducer;
