import { logger } from "../shared/index.js";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../modules/auth/utils/verify_accessToken.js";

const extractToken = (req: Request): string | null => {
    const header = req.headers.authorization;
    if(header?.startsWith("Bearer ")){
        return header.substring(7);
    }

    return req.cookies?.accessToken ?? null;
}

export const authentication = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = extractToken(req);
        const authContext = await verifyAccessToken(token ?? "");

        req.user = authContext.user;
        next();
    } catch (error) {
        logger.warn("HTTP authentication failed", {
            path: req.path,
            ip: req.ip,
        });

        res.status(401).json({
            success: false,
            message: "Unauthorized",
        })
    }
}

