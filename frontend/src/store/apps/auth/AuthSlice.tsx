// src/store/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ACCESS_TOKEN, REFRESH_TOKEN } from 'src/services/api/auth.api';
import { LoginResponse, RefreshTokenResponse, User } from 'src/types/auth/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  user: User | null;
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
    refreshTokenRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    refreshTokenSuccess: (state, action: PayloadAction<RefreshTokenResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem(ACCESS_TOKEN, state.accessToken);
      localStorage.setItem(REFRESH_TOKEN, state.refreshToken);
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
    },
    updateUserSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = { ...state.user, ...action.payload };
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const selectIsAuthenticated = (state: { auth: AuthState }) => !!(state.auth.user && state.auth.accessToken);
export const selectUserId = (state: { auth: AuthState }) => state.auth.user?.id;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.loading;

export const { loginRequest, loginSuccess, loginFailure, logoutSuccess, refreshTokenRequest, refreshTokenFailure, refreshTokenSuccess,
  updateUserSuccess,
  updateUserFailure,
 } = authSlice.actions;
export default authSlice.reducer;
