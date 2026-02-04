import http from "http";
import { app } from "../app.js";
import { Server } from "socket.io";
import { logger } from "../shared/index.js";
import { socketAuthentication } from "./socket.auth.js";
import { socketRedisAdapter, connectSocketRedis } from "./redis.adapter.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
});

await connectSocketRedis();
io.adapter(socketRedisAdapter);

io.use(socketAuthentication);

io.on("connection", (socket) => {
    logger.info("Socket connected", { socketId: socket.id });

    const rawUserId = socket.handshake.query.userId;

    if (typeof rawUserId !== "string" || rawUserId.trim() === "") {
        logger.warn("Socket connected without valid userId", {
            socketId: socket.id,
        });
        socket.disconnect(true);
        return;
    }

    const userRoom = `user:${rawUserId}`;
    socket.data.userId = rawUserId;
    socket.join(userRoom);

    logger.info("Socket joined room", {
        socketId: socket.id,
        room: userRoom,
    });

    socket.on("disconnect", () => {
        logger.info("Socket disconnected", {
            socketId: socket.id,
            userId: socket.data.userId,
        });
    });
});

export { io, server };
