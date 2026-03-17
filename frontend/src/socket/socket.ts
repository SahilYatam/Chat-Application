import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const SOCKET_URL = "https://chat-application-backend-latest-xs6u.onrender.com"

export const connectSocket = (userId: string, token: string) => {
    if (socket) return socket;

    socket = io(SOCKET_URL, {
        auth: { token },
        query: { userId },
        withCredentials: true,
        transports: ["websocket"],

        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
    });

    return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};