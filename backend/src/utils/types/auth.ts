import User from "../../models/User";

export interface UserResponse {
    success: boolean
    message: string
    user?: User
}

export interface  LoginResponse {
    success: boolean
    message: string
    accessToken: string
    refreshToken: string
}