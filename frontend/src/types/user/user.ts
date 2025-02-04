export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
  USER = 'USER',
}

export interface User {
  id: string;
  role: UserRole;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  position?: string;
  contactDetails?: string;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
  photo?: string;
}
