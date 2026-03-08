import { Socket } from "socket.io-client";
import { store } from "../../store/store";

import { messageReceived, messageUpdated, messageDeleted, messageRead } from "./chatSlices";

export const registerChatSocketEvents = (socket: Socket) => {
    socket.on("chat:message", (message) => {
        console.log("🔥 SOCKET MESSAGE RECEIVED:", message);
        store.dispatch(messageReceived(message));
    });

    socket.on("chat:message-edited", (data) => {
        console.log("✏️ MESSAGE EDITED:", data);
        store.dispatch(messageUpdated(data));
    });

    socket.on("chat:message-deleted", (data) => {
        console.log("🗑 MESSAGE DELETED:", data);
        store.dispatch(messageDeleted(data));
    });

    socket.on("chat:message-read", (data) => {
        console.log("👀 Messages read:", data);
        store.dispatch(messageRead(data))
    })
};
