// src/store/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ACCESS_TOKEN, LoginResponse, REFRESH_TOKEN, RefreshTokenResponse } from 'src/services/api/auth.api';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  user: any;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem(ACCESS_TOKEN, state.accessToken);
      localStorage.setItem(REFRESH_TOKEN, state.refreshToken);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
    },
    refreshTokenSuccess: (state, action: PayloadAction<RefreshTokenResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem(ACCESS_TOKEN, state.accessToken);
      localStorage.setItem(REFRESH_TOKEN, state.refreshToken);
    },
  },
});

export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.user;

export const { loginRequest, loginSuccess, loginFailure, logoutSuccess, refreshTokenSuccess } = authSlice.actions;
export default authSlice.reducer;
