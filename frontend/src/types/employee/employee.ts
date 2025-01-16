import { UserResponse } from 'src/types/auth/auth'; // Путь к вашему типу UserResponse

export interface EmployeeResponse {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: UserResponse; // Подключаем тип пользователя
}

export interface Employee extends EmployeeResponse {}

export interface EmployeeTable {}