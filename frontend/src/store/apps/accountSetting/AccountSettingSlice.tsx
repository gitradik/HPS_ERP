import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { UpdateUserInput, User, UserRole } from 'src/types/auth/auth';


// Начальное состояние
const initialState: UpdateUserInput = {};

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
    resetAccountSetting: () => initialState, // Reset state from initial

    updateAccountSetting: (state, action: PayloadAction<User>) => {
      const { id, updatedAt, createdAt, ...rest } = action.payload;
      return { ...state, ...rest };
    },
  },
});

// Селекторы (пример)
export const selectAccountSetting = (state: { accountSetting: UpdateUserInput }) =>
  state.accountSetting;
export const selectAccountSettingIsEmpty = (state: { accountSetting: UpdateUserInput }) =>
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
  resetAccountSetting,
  updateAccountSetting,
} = accountSettingSlice.actions;

// Экспорт редьюсера
export default accountSettingSlice.reducer;
