import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import { authApi } from '../services/api';
import customizerReducer from './customizer/CustomizerSlice';
import userProfileReducer from './apps/userProfile/UserProfileSlice';
import authReducer from './apps/auth/AuthSlice';

export const store = configureStore({
  reducer: {
    customizer: customizerReducer,
    userProfile: userProfileReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer, // Добавление authApi
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware), // Подключение middleware для RTK Query
});

setupListeners(store.dispatch);

// Типизация для RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Экспорт кастомных хуков useSelector и useDispatch
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
