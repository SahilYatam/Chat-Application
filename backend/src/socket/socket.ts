import http from "http";
import { app } from "../app.js";
import { Server } from "socket.io";
import { logger } from "../shared/index.js";
import { socketAuthentication } from "./socket.auth.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
});

type UserSocketMap = Record<string, Set<string>>;
const userSocketMap: UserSocketMap = {}; // {userId: Set<socketId>}

export const getReceiverSocketIds = (receiverId: string): string[] => {
    return Array.from(userSocketMap[receiverId] ?? []);
}

io.use(socketAuthentication);

io.on("connection", (socket) => {
    logger.info("Socket connected", {socketId: socket.id});

    const rawUserId = socket.handshake.query.userId;

    if(typeof rawUserId !== "string" || rawUserId.trim() === ""){
        logger.warn("Socket connected without valid userId", {socketId: socket.id});
        socket.disconnect(true);
        return;
    }

    const userId = rawUserId;
    socket.data.userId = userId;

    if(!userSocketMap[userId]){
        userSocketMap[userId] = new Set();
    }

    userSocketMap[userId].add(socket.id)

    io.emit("onlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        const uid = socket.data.userId;
        logger.info("Socket disconnected", { socketId: socket.id, userId: uid });

        if(!uid) return;

        const sockets = userSocketMap[uid];
        if(!sockets) return;

        sockets.delete(socket.id);

        if(sockets.size === 0) {
            delete userSocketMap[uid]
        }

        io.emit("onlineUsers", Object.keys(userSocketMap));

    })

})


export { io, server };
