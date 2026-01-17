import jwt, { JwtPayload } from "jsonwebtoken";
import { userRepo } from "../../user/user.repository.js";
import { ApiError, logger } from "../../../shared/index.js";
import { UserDocument } from "../../user/user.model.js";

export interface AuthJwtPayload extends JwtPayload {
    userId?: string;
    id?: string;
    sub?: string;
}

export interface AuthContext {
    userId: string;
    user: UserDocument;
}

export const verifyAccessToken = async (
    token: string,
): Promise<AuthContext> => {
    if (!token) throw new ApiError(401, "Unauthorized");

    const secret = process.env.ACCESS_TOKEN;
    if (!secret) {
        logger.error("ACCESS_TOKEN secret not configured");
        throw new Error("Server misconfiguration");
    }

    let decoded: AuthJwtPayload;

    try {
        decoded = jwt.verify(token, secret) as AuthJwtPayload;
    } catch (error) {
        throw new ApiError(401, "Unauthorized");
    }

    const userId = decoded.userId || decoded.id || decoded.sub;

    if (!userId) {
        logger.warn("JWT missing user identifier", { payload: decoded });
        throw new ApiError(401, "Unauthorized");
    }

    const user = await userRepo.findUserById(userId);
    if (!user) throw new ApiError(401, "Unauthorized");

    return { userId, user };
};
