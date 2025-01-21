import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import { authApi, clientApi, employeeApi, staffApi, userApi } from '../services/api';
import authReducer from './apps/auth/AuthSlice';
import accountSettingReducer from './apps/setting/AccountSettingSlice';
import clientSettingReducer from './apps/setting/ClientSettingSlice';
import customizerReducer from './customizer/CustomizerSlice';
import userProfileReducer from './apps/userProfile/UserProfileSlice';
import registerReducer from './apps/auth/RegisterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    accountSetting: accountSettingReducer,
    clientSetting: clientSettingReducer,
    register: registerReducer,
    customizer: customizerReducer,
    userProfile: userProfileReducer,
    [userApi.reducerPath]: userApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      employeeApi.middleware,
      clientApi.middleware,
      staffApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
