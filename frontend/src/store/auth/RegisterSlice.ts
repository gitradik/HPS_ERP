import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from 'src/types/user/user';

// Define the initial state for registration
interface RegisterState {
  loading: boolean;
  error: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  position?: string;
  role?: UserRole;
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
  position: '',
  role: UserRole.USER,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
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
