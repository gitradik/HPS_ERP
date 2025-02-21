import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import {
  authApi,
  clientApi,
  employeeApi,
  scheduleApi,
  staffApi,
  uploadApi,
  userApi,
  scheduleOvertimeApi,
} from '../services/api';
import authReducer from './auth/AuthSlice';
import accountSettingReducer from './apps/setting/AccountSettingSlice';
import clientSettingReducer from './apps/setting/ClientSettingSlice';
import customizerReducer from './customizer/CustomizerSlice';
import userProfileReducer from './apps/userProfile/UserProfileSlice';
import registerReducer from './auth/RegisterSlice';
import staffScheduleReducer from './staffSchedule/StaffScheduleSlice';
import clientQueryParamsReducer from './queryParams/ClientQueryParamsSlice';
import staffQueryParamsReducer from './queryParams/StaffQueryParamsSlice';
import employeeQueryParamsReducer from './queryParams/EmployeeQueryParamsSlice';
import userQueryParamsReducer from './queryParams/UserQueryParamsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    accountSetting: accountSettingReducer,
    clientSetting: clientSettingReducer,
    register: registerReducer,
    customizer: customizerReducer,
    userProfile: userProfileReducer,
    staffSchedule: staffScheduleReducer,
    clientQueryParams: clientQueryParamsReducer,
    staffQueryParams: staffQueryParamsReducer,
    employeeQueryParams: employeeQueryParamsReducer,
    userQueryParams: userQueryParamsReducer,
    [userApi.reducerPath]: userApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [scheduleOvertimeApi.reducerPath]: scheduleOvertimeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      userApi.middleware,
      employeeApi.middleware,
      clientApi.middleware,
      staffApi.middleware,
      uploadApi.middleware,
      scheduleApi.middleware,
      scheduleOvertimeApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
