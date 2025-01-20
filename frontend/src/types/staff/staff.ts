import { UserResponse } from 'src/types/auth/auth';

export interface StaffResponse {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: UserResponse;
  isAssigned: boolean
}

export interface Staff extends StaffResponse {}

export interface StaffTable {}