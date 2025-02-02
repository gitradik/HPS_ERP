import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client, ClientStatus, UpdateClientInput } from 'src/types/client/client';

const initialState: Partial<UpdateClientInput> = {};

const clientSettingSlice = createSlice({
  name: 'clientSetting',
  initialState,
  reducers: {
    setClientCompanyName: (state, action: PayloadAction<string>) => {
      state.companyName = action.payload;
    },
    setClientStatus: (state, action: PayloadAction<ClientStatus>) => {
      state.status = action.payload;
    },
    resetClientSetting: () => initialState,

    updateClientSetting: (state, action: PayloadAction<Partial<Client>>) => {
      const { companyName, status } = action.payload;
      state.companyName = companyName;
      state.status = status;
    },
  },
});

export const selectClientSetting = (state: { clientSetting: UpdateClientInput }) =>
  state.clientSetting;

export const {
  setClientCompanyName,
  setClientStatus,
  resetClientSetting,
  updateClientSetting,
} = clientSettingSlice.actions;

export default clientSettingSlice.reducer;
