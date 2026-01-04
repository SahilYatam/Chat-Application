import {z} from "zod";
import { authSchema } from "./auth.schema.js";


// ============== Input Types ==============

export type SignupInput = z.infer<typeof authSchema.signupSchema>;

export type LoginInput = z.infer<typeof authSchema.loginSchema>;

export type CreateSessionInput = z.infer<typeof authSchema.createSessionSchema>;

// ============== Return Types ==============

export type UserPublicData = {
    userId: string;
    username: string,
    name: string,
    avatar: string
}

export type AuthTokens = {
    accessToken: string,
    refreshToken: string,
}
