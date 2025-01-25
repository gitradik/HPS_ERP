import { User } from 'src/types/auth/auth';

export interface StaffResponse {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  isAssigned: boolean;
}

export interface Staff extends StaffResponse {}

export interface StaffTable {}
