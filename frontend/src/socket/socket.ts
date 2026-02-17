import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string, userId: string) => {
    socket = io(import.meta.env.SOCKET_URL, {
        auth: { token },
        query: { userId },
        transports: ["websocket"],
    });

    return socket;
};

export const getSocket = (): Socket => {
    if (!socket) {
        throw new Error("Socket not initialized");
    }
    return socket;
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};
