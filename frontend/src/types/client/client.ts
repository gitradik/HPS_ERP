import { UserResponse } from 'src/types/auth/auth';

export interface ClientResponse {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: UserResponse;
}

export interface Client extends ClientResponse {}

export interface ClientTable {}