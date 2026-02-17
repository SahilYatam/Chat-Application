// User model representing autheticated user data

export interface User {
    _id: string;
    username: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

// Public user profile

export interface UserProfile {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
}