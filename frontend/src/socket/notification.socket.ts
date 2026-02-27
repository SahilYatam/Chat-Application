import { Socket } from "socket.io-client";
import type { AppDispatch } from "../store/store";
import {notificationReceived} from "../features/notification/notification.slices"
import type { AppNotification, NotificationType } from "../types";

type RealtimeNotificationPayload = {
    notificationId: string;
    receiverId: string;
    type: NotificationType;
    entityId: string;
    senderUsername: string;
    createdAt: string;
}

export const registerNotificationSocket = (
    socket: Socket,
    dispatch: AppDispatch
) => {
    console.log("📡 Registering notification listener, socket connected:", socket.connected);

    socket.off("notification:new");

    socket.on("notification:new", (payload: RealtimeNotificationPayload) => {
        console.log("🔔 Notification received:", payload)

        const notification: AppNotification = {
            id: payload.notificationId,
            receiverId: payload.receiverId,
            type: payload.type,
            entityId: payload.entityId,
            isRead: false,
            isDelivered: false,
            senderUsername: payload.senderUsername,
            createdAt: payload.createdAt
        };
        dispatch(notificationReceived(notification))
    })
}