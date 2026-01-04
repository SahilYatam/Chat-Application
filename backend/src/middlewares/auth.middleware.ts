import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError, logger } from "../shared/index.js";
import { Request, Response, NextFunction } from "express";
import { userRepo } from "../modules/user/user.repository.js";

interface AuthJwtPayload extends JwtPayload {
    userId?: string;
    id?: string;
    sub?: string;
}

export const authentication = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        const accessToken: string | undefined = req.cookies?.accessToken || tokenFromHeader;

        if (!accessToken) {
            throw new ApiError(401, "Unauthorized - No access token provided");
        }

        const secret = process.env.ACCESS_TOKEN;
        if (!secret) {
            throw new Error("ACCESS_TOKEN secret not configured");
        }

        const decoded = jwt.verify(accessToken, secret) as AuthJwtPayload;

        const userId = decoded.userId || decoded.id || decoded.sub;

        if (!userId) {
            logger.error("❌ Token payload missing user identifier", {
                payload: decoded,
                availableKeys: Object.keys(decoded),
            });
            throw new ApiError(401, "Invalid token payload - missing user identifier");
        }

        const user = await userRepo.findUserById(userId);

        if (!user) {
            logger.error("❌ User not found in database", { userId });
            throw new ApiError(401, "Invalid token - user not found");
        }

        req.user = user;
        next();
    } catch (err) {
        const error = err as Error;

        logger.error("❌ Authentication middleware error", {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });

        if (err instanceof ApiError) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message,
            });
            return;
        }

        if (err instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid token",
                errorMessage: err.message,
            });
            return;
        }

        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: "Token expired",
                errorMessage: err.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            errorMessage: error.message,
        });
    }
}
