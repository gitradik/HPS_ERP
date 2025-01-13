import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisterResponse } from 'src/types/auth/auth';

// Define the initial state for registration
interface RegisterState {
    loading: boolean,
    error: string | null,
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const initialState: RegisterState = {
    loading: false,
    error: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
      registerRequest: (state) => {
        state.loading = true;
        state.error = null;
      },
      registerSuccess: (state, action: PayloadAction<RegisterResponse>) => {
        state.loading = false;
      },
      registerFailure: (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      },
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    resetRegister: () => initialState,
  },
});

export const {
    registerRequest,
    registerSuccess,
    registerFailure,
  setFirstName,
  setLastName,
  setEmail,
  setPhoneNumber,
  setPassword,
  setConfirmPassword,
  resetRegister,
} = registerSlice.actions;


export const selectIsLoading = (state: { register: RegisterState }) => state.register.loading;
export const selectRegister = (state: { register: RegisterState }) => state.register;

export default registerSlice.reducer;
