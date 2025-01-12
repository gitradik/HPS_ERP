export interface registerType {
  title?: string;
  subtitle?: any | any[];
  subtext?: any | any[];
}

export interface loginType {
  title?: string;
  subtitle?: any | any[];
  subtext?: any | any[];
}

export interface signInType {
  title?: string;
}

export interface UserResponse {
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
}

export interface UpdateUserInput {
  role?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  contactDetails?: string;
  isActive?: boolean;
}


export interface LoginInput {
  email?: string;
  phoneNumber?: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user?: any
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user?: any
}

export interface LogoutResponse {
  success: boolean;
}

export interface User extends UserResponse {}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
  CLIENT = "CLIENT",
  USER = "USER",
}

