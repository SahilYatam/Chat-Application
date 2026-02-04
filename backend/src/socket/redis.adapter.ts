import { createAdapter } from "@socket.io/redis-adapter";
import { redisConnection } from "../config/redis.js";
import { logger } from "../shared/index.js";

const pubClient = redisConnection;

const subClient = redisConnection.duplicate();

export const connectSocketRedis = async () => {
    try {
        if (subClient.status === "end") await subClient.connect();
        logger.info("[SocketRedis] Redis adapter connected");
    } catch (err) {
        logger.error("[SocketRedis] Redis adapter failed to connect", err);
    }
};

export const socketRedisAdapter = createAdapter(pubClient, subClient);
