import { Socket } from "socket.io-client";
import { store } from "../store/store";
import { messageReceived } from "../features/chat/chatSlices";

export const registerSocketListeners =(socket: Socket) => {
    // New chat message
    socket.on("message", (payload) => {
        store.dispatch(messageReceived(payload))
    });
}