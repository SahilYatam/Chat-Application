import { io } from "./socket.js";
import { logger } from "../shared/index.js";

export type RealtimeNotificationPayload = {
    notificationId: string;
    receiverId: string;
    type: string;
    createdAt: Date;
};

export const emitNotificationToUser = (
    receiverId: string,
    payload: RealtimeNotificationPayload,
) => {
    try {
        const room = `user:${receiverId}`;

        io.to(room).emit("notification:new", payload);

        logger.debug("[Socket] Notification emitted", {
            receiverId,
            room,
            notificationId: payload.notificationId
        })
        
    } catch (err) {
        logger.error("[Socket] Failed to emit realtime notification", {
            receiverId,
            error: err,
        });
    }
};
