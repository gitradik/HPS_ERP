import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import { authApi } from '../services/api';
import authReducer from './apps/auth/AuthSlice';
import accountSettingReducer from './apps/accountSetting/AccountSettingSlice';
import customizerReducer from './customizer/CustomizerSlice';
import userProfileReducer from './apps/userProfile/UserProfileSlice';
import notificationsReducer from './apps/notifications/NotificationsSlice';
import registerReducer from './apps/auth/RegisterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    accountSetting: accountSettingReducer,
    register: registerReducer,
    notifications: notificationsReducer,
    customizer: customizerReducer,
    userProfile: userProfileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
