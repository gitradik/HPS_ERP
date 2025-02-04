// src/store/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ACCESS_TOKEN, REFRESH_TOKEN } from 'src/services/api/authApi';
import { LoginResponse, RefreshTokenResponse } from 'src/types/auth/auth';
import { User } from 'src/types/user/user';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem(ACCESS_TOKEN) || null,
  refreshToken: localStorage.getItem(REFRESH_TOKEN) || null,
  loading: false,
  error: null,
  user: null,
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
    emailVerifyRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    emailVerifySuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem(ACCESS_TOKEN, state.accessToken);
      localStorage.setItem(REFRESH_TOKEN, state.refreshToken);
    },
    emailVerifyFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  Boolean(state.auth.user && state.auth.accessToken);
export const selectUserId = (state: { auth: AuthState }) => state.auth.user?.id;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

export const selectIsLoading = (state: { auth: AuthState }) => state.auth.loading;

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  refreshTokenRequest,
  refreshTokenFailure,
  refreshTokenSuccess,
  updateUserSuccess,
  updateUserFailure,
  emailVerifyRequest,
  emailVerifySuccess,
  emailVerifyFailure,
} = authSlice.actions;
export default authSlice.reducer;
