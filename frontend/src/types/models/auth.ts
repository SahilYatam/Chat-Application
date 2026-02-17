import type { User } from "./user";

export interface SignupCredentials {
    username: string;
    name: string;
    email: string;
    password: string;
    gender: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

// Response from successful authentication
export interface AuthResponse {
    user: User;
    accessToken: string;
}

// Username & Password reset request
export interface UsernameAndPasswordResetRequest {
    email: string
}

// Password reset confirmation
export interface PasswordRestConfirm {
    token: string;
    newPassword: string;
}

