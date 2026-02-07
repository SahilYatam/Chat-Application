import type { User } from "./user";

export interface SignupCredentials {
    username: string;
    name: string;
    email: string;
    password: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

// Response from successful authentication
export interface AuthResponse {
    user: User
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

