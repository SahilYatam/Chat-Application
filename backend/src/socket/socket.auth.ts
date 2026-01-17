import { Socket } from "socket.io";
import { logger } from "../shared/index.js";
import { verifyAccessToken } from "../modules/auth/utils/verify_accessToken.js";

export const socketAuthentication = async (
    socket: Socket,
    next: (err?: Error) => void,
) => {
    try {
        const token = socket.handshake.auth?.token;

        if (typeof token !== "string" || !token) {
            return next(new Error("Unauthorized"));
        }

        const authContext = await verifyAccessToken(token);
        socket.data.user = authContext.user;

        next();
    } catch (error) {
        logger.warn("Socket authentication failed", {
            socketId: socket.id,
        });

        next(new Error("Unauthorized"));
    }
};
