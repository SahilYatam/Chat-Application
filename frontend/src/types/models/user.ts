// User model representing autheticated user data

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

// Public user profile

export interface UserProfile {
    id: string;
    username: string;
    name: string;
    avatar?: string;
}