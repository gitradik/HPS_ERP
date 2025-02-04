import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { UpdateUserInput } from 'src/types/auth/auth';
import { User, UserRole } from 'src/types/user/user';

export interface AccountSettingState extends UpdateUserInput {
  confirmPassword?: string;
}

// Начальное состояние
const initialState: AccountSettingState = {};

// Создание slice
const accountSettingSlice = createSlice({
  name: 'accountSetting',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
    setEmail: (state, action: PayloadAction<string | undefined>) => {
      state.email = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string | undefined>) => {
      state.phoneNumber = action.payload;
    },
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setPosition: (state, action: PayloadAction<string | undefined>) => {
      state.position = action.payload;
    },
    setContactDetails: (state, action: PayloadAction<string | undefined>) => {
      state.contactDetails = action.payload;
    },
    setIsActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    resetAccountSetting: () => initialState, // Reset state from initial

    updateAccountSetting: (state, action: PayloadAction<User>) => {
      const { id, updatedAt, createdAt, ...rest } = action.payload;
      return { ...state, ...rest };
    },
  },
});

// Селекторы (пример)
export const selectAccountSetting = (state: { accountSetting: AccountSettingState }) =>
  state.accountSetting;
export const selectAccountSettingIsEmpty = (state: { accountSetting: AccountSettingState }) =>
  isEmpty(state.accountSetting);

// Экспорт действий
export const {
  setRole,
  setEmail,
  setPhoneNumber,
  setFirstName,
  setLastName,
  setPosition,
  setContactDetails,
  setIsActive,
  setPassword,
  setConfirmPassword,
  resetAccountSetting,
  updateAccountSetting,
} = accountSettingSlice.actions;

// Экспорт редьюсера
export default accountSettingSlice.reducer;
