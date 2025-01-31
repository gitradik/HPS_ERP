import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
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
    resetClientSetting: () => initialState,

    updateClientSetting: (state, action: PayloadAction<Partial<Client>>) => {
      const { companyName, isWorking } = action.payload;
      state.companyName = companyName;
      state.isWorking = isWorking;
    },
  },
});

export const selectClientSetting = (state: { clientSetting: UpdateClientInput }) =>
  state.clientSetting;
export const selectClientSettingIsEmpty = (state: { clientSetting: UpdateClientInput }) =>
  isEmpty(state.clientSetting);

export const { setCompanyName, setIsWorking, resetClientSetting, updateClientSetting } =
  clientSettingSlice.actions;

export default clientSettingSlice.reducer;
