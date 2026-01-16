import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const NOTIFICATION_DELIVERY_QUEUE = "notification-delivery-queue";

export const notificationDeliveryQueue = new Queue(
    NOTIFICATION_DELIVERY_QUEUE,
    {
        connection: redisConnection,

        // Default behavior for all notification jobs
        defaultJobOptions: {
            attempts: 5, // Retry on transient failuers
            backoff: {
                type: "exponential", // Progressive delay
                delay: 2000, // Initial delay (ms)
            },
            removeOnComplete: 1000, // Prevent redis bloat
            removeOnFail: 5000,
        },
    }
);
