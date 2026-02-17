import { Socket } from "socket.io-client";
import type { AppDispatch } from "../store/store";
import {notificationReceived} from "../features/notification/notification.slices"
import type { Notifcation } from "../types";

type RealtimeNotificationPayload = {
    notificationId: string;
    receiverId: string;
    type: string;
    createdAt: string;
}

export const registerNotificationSocket = (
    socket: Socket,
    dispatch: AppDispatch
) => {
    socket.on("notification:new", (payload: RealtimeNotificationPayload) => {
        const notification: Notifcation = {
            id: payload.notificationId,
            receiverId: payload.receiverId,
            type: payload.type,
            entityId: "",
            isRead: false,
            createdAt: payload.createdAt
        };
        dispatch(notificationReceived(notification))
    })
}