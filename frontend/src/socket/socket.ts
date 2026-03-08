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

        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
    });

     socket.on("connect", () => {
        console.log("🟢 Client Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("🔴 Disconnected because:", reason);
    });

    socket.on("connect_error", (err) => {
        console.log("⚠️ Connection error:", err.message);
    });

    socket.on("reconnect_attempt", (attempt) => {
        console.log("🔄 Reconnect attempt:", attempt);
    });

    socket.on("reconnect", (attempt) => {
        console.log("✅ Reconnected after attempts:", attempt);
    });

    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};
