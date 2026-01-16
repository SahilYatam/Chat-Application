import { Redis } from "ioredis";
import { logger } from "../shared/index.js";

const REDIS_HOST = process.env.REDIS_HOST ?? "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT ?? 6379);

export const redisConnection = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
});

/**
 * Connection observability
 */

redisConnection.on("connect", () => {
    logger.info("[Redis] connected successfully");
});

redisConnection.on("ready", () => {
    logger.info("[Redis] Ready to accept commands");
});

redisConnection.on("error", (error) => {
    logger.error("[Redis] Connection error:", error);
});

redisConnection.on("close", () => {
    logger.warn("[Redis] Connection closed");
});

