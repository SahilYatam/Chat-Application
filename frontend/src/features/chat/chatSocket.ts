import { Socket } from "socket.io-client";
import { store } from "../../store/store";

import { messageReceived, messageUpdated, messageDeleted } from "./chatSlices";

export const registerChatSocketEvents = (socket: Socket) => {
    socket.on("chat:message", (message) => {
        console.log("🔥 SOCKET MESSAGE RECEIVED:", message);
        store.dispatch(messageReceived(message));
    });

    socket.on("chat:message-edited", (message) => {
        console.log("✏️ MESSAGE EDITED:", message);
        store.dispatch(messageUpdated(message));
    });

    socket.on("chat:message-deleted", ({ conversationId, chatId }) => {
        console.log("🗑 MESSAGE DELETED:", conversationId, chatId);
        store.dispatch(messageDeleted({ conversationId, chatId }));
    });
};
