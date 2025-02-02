import { UserResponse } from 'src/types/auth/auth';

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLACKLIST = 'BLACKLIST',
}

export interface ClientResponse {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: UserResponse;
  companyName?: string;
  status: ClientStatus;
}

export interface Client extends ClientResponse {}

export interface ClientTable {}

export interface UpdateClientInput {
  companyName?: string;
  status?: ClientStatus;
}
