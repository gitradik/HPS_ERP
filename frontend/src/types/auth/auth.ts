import { User, UserRole } from '../user/user';

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

export interface UserResponse extends User {}

export interface UpdateUserInput {
  role?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  position?: string;
  contactDetails?: string;
  isActive?: boolean;
  photo?: string;
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
  user?: any;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  position?: string;
  role?: UserRole;
}

export interface RegisterResponse {
  message: string;
  success: boolean;
  user: User;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user?: any;
}

export interface LogoutResponse {
  success: boolean;
}
