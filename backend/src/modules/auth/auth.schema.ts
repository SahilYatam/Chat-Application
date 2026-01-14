import { z } from "zod";
import { Gender } from "../user/user.model.js";

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const signupSchema = z.object({
    username: z.string().min(3).max(30),
    name: z.string().min(3).max(50),
    password: z.string().min(8),
    gender: z.enum(Gender),
    email: z.string().email().optional()
});

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

const refreshTokenValidationSchema = z.object({
    refreshToken: z.string().min(20).max(100)
})

const createSessionSchema = z.object({
  userId: z.string().min(1),
});

const emailValidationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim(),
});

const resetPasswordParamsSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
});

const resetPasswordBodySchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const authSchema = {
    signupSchema,
    loginSchema,
    refreshTokenValidationSchema,
    createSessionSchema,
    emailValidationSchema,
    resetPasswordParamsSchema,
    resetPasswordBodySchema,
}
