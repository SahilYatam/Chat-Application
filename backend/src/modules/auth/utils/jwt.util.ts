import jwt, {SignOptions} from "jsonwebtoken";
import { generateToken } from "./encryptToken.util.js";
import { Types } from "mongoose";

interface JwtPayload {
    userId: string;
}

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
}

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export const generateAccessAndRefreshToken = (userId: string): AuthTokens => {
    const secret = process.env.ACCESS_TOKEN;
    if(!secret) throw new Error("ACCESS_TOKEN secret is not defined");

    const accessToken = jwt.sign(
        {userId} as JwtPayload,
        secret,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
            issuer: "chat-app",
            audience: "user",
        }
    );
    const refreshToken = generateToken();

    const refreshTokenExpiresAt = new Date(
        Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    return {
        accessToken,
        refreshToken,
        refreshTokenExpiresAt
    }
}
