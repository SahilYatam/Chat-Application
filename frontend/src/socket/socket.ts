import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
console.log("URL:", import.meta.env.VITE_SOCKET_URL);

export const connectSocket = (userId: string, token: string) => {
    if (socket?.connected) return socket;
    socket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: { token },
        query: { userId },
        withCredentials: true,
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
