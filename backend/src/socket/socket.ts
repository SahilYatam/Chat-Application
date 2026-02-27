import http from "http";
import { Server } from "socket.io";
import { QueueEvents } from "bullmq";
import { app } from "../app.js";
import { logger } from "../shared/index.js";
import { socketAuthentication } from "./socket.auth.js";
import { socketRedisAdapter, connectSocketRedis } from "./redis.adapter.js";
import { redisConnection } from "../config/redis.js";
import { NOTIFICATION_DELIVERY_QUEUE } from "../queue/notification.queue.js";
import { RealtimeNotificationPayload } from "./notification.socket.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
});

// 🔥 QueueEvents is REQUIRED to read worker return values
const notificationQueueEvents = new QueueEvents(NOTIFICATION_DELIVERY_QUEUE, {
    connection: redisConnection,
});

notificationQueueEvents.on("completed", ({ returnvalue }) => {
    if(!returnvalue || typeof returnvalue !== "object"){
        return;
    }

    const result = returnvalue as {
        delivered?: boolean;
        payload?: RealtimeNotificationPayload | null;
    };

    if (!result?.payload) return;

    const room = `user:${result.payload.receiverId}`;

    logger.info(`📢 Emitting notification to ${room}`);
    io.to(room).emit("notification:new", result.payload);
});

await connectSocketRedis();
io.adapter(socketRedisAdapter);

io.use(socketAuthentication);

io.on("connection", (socket) => {
    const userId = socket.data.user?._id || socket.data.user?.id;

    if (!userId) {
        socket.disconnect(true);
        return;
    }

    const room = `user:${userId}`;
    socket.join(room);

    logger.info("🟢 Socket connected", {
        socketId: socket.id,
        room,
    });

    socket.on("disconnect", (reason) => {
        logger.info("🔴 Socket disconnected", {
            socketId: socket.id,
            reason,
        });
    });
});

export { io, server };
