import { UserResponse } from 'src/types/auth/auth';

export interface ClientResponse {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: UserResponse;
  companyName?: string;
  isWorking: boolean;
  isProblematic: boolean;
}

export interface Client extends ClientResponse {}

export interface ClientTable {}

export interface UpdateClientInput {
  companyName?: string;
  isWorking: boolean;
  isProblematic: boolean;
}
