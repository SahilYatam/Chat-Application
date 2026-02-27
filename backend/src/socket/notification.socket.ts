import { io } from "./socket.js";
import { logger } from "../shared/index.js";

export type RealtimeNotificationPayload = {
    notificationId: string;
    receiverId: string;
    entityId: string,
    senderUsername: string;
    type: string;
    createdAt: Date;
};

export const emitNotificationToUser = async(
    receiverId: string,
    payload: RealtimeNotificationPayload,
) => {
    try {
        const room = `user:${receiverId}`;

        const sockets = await io.in(room).fetchSockets();
        console.log("Sockets in room:", sockets.length);

        console.log("📢 Emitting to room:", room);

        io.to(room).emit("notification:new", payload);

        logger.debug("[Socket] Notification emitted", {
            receiverId,
            room,
            notificationId: payload.notificationId,
        });
    } catch (err) {
        logger.error("[Socket] Failed to emit realtime notification", {
            receiverId,
            error: err,
        });
    }
};
