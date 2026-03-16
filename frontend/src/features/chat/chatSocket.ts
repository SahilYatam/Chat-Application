import { Socket } from "socket.io-client";
import { store } from "../../store/store";

import {
    messageReceived,
    messageUpdated,
    messageDeleted,
    messageRead,
} from "./chatSlices";

export const registerChatSocketEvents = (socket: Socket) => {
    // Remove previous listeners, prevents duplicates after reconnect
    socket.off("chat:message");
    socket.off("chat:message-edited");
    socket.off("chat:message-deleted");
    socket.off("chat:message-read");
    socket.off("chat:typing");
    socket.off("chat:stop-typing");

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
        store.dispatch(messageRead(data));
    });
};
