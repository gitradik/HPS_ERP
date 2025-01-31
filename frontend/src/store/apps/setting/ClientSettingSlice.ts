import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client, UpdateClientInput } from 'src/types/client/client';

const initialState: Partial<UpdateClientInput> = {};

const clientSettingSlice = createSlice({
  name: 'clientSetting',
  initialState,
  reducers: {
    setCompanyName: (state, action: PayloadAction<string>) => {
      state.companyName = action.payload;
    },
    setIsWorking: (state, action: PayloadAction<boolean>) => {
      state.isWorking = action.payload;
    },
    setIsProblematic: (state, action: PayloadAction<boolean>) => {
      state.isProblematic = action.payload;
    },
    resetClientSetting: () => initialState,

    updateClientSetting: (state, action: PayloadAction<Partial<Client>>) => {
      const { companyName, isWorking, isProblematic } = action.payload;
      state.companyName = companyName;
      state.isWorking = isWorking;
      state.isProblematic = isProblematic;
    },
  },
});

export const selectClientSetting = (state: { clientSetting: UpdateClientInput }) =>
  state.clientSetting;

export const {
  setCompanyName,
  setIsWorking,
  resetClientSetting,
  updateClientSetting,
  setIsProblematic,
} = clientSettingSlice.actions;

export default clientSettingSlice.reducer;
