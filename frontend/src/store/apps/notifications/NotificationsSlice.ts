import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Типы уведомлений
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Интерфейс уведомления
export interface Notification {
  id?: string; // Уникальный идентификатор
  message: string; // Текст уведомления
  type: NotificationType; // Тип уведомления
  autoHideDuration?: number; // Время автоматического скрытия в миллисекундах
}

// Начальное состояние
interface NotificationsState {
  notifications: Notification[];
}

const initialState: NotificationsState = {
  notifications: [],
};

// Notifications Slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push({
        ...action.payload,
        id: uuidv4(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const selectNotifications = (state: { notifications: NotificationsState }) =>
  state.notifications.notifications;

// Экспорт действий
export const { addNotification, removeNotification } = notificationsSlice.actions;

// Экспорт редюсера
export default notificationsSlice.reducer;
