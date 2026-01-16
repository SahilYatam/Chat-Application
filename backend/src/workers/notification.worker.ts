import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { notificationRepo } from "../modules/notification/notification.respository.js";
import { NOTIFICATION_DELIVERY_QUEUE } from "../queue/notification.queue.js";
import { logger, normalizeObjectId } from "../shared/index.js";
import { Types } from "mongoose";

type NotificationJobPayload = {
    notificationId: string;
    receiverId: string;
    type: string;
};

export const notificationWorker = new Worker(
    NOTIFICATION_DELIVERY_QUEUE,
    async (job: Job<NotificationJobPayload>) => {
        const { notificationId, receiverId, type } = job.data;

        // --- Defensive validation ---
        if (!notificationId || !receiverId || !type) {
            throw new Error("Invalid notification job payload");
        }

        try {
            logger.info(
                `[NoficationWroker] Processing job=${job.id}, type=${type}, notificationId=${notificationId}`
            );

            /**
             * 🚧 Temporary delivery simulation
             * Replace this later with Socket.IO emit + ACK flow.
             */

            await new Promise((resolve) => setTimeout(resolve, 300));

            // Makr delivered
            const notifId = normalizeObjectId(notificationId)
            const receId = normalizeObjectId(receiverId)
            
            const result = await notificationRepo.markAsDelivered({
                notificationId: notifId,
                receiverId: receId,
            });

            if (!result.delivered) {
                logger.info(
                    `[NotificationWorker] Notification already delivered or not found: ${notificationId}`
                );
            } else {
                logger.info(
                    `[NotificationWorker] Delivered notification: ${notificationId}`
                );
            }
            return {
                delivered: true,
            };
        } catch (error) {
            logger.error(
                `[NotificationWroker] Failed job=${job.id}, notificationId=${notificationId}`,
                error
            );

            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: 5, // tune based on CPU / IO profile
    }
);

notificationWorker.on("completed", (job) => {
    logger.info(`[NotificationWorker] Job completed: ${job.id}`);
});

notificationWorker.on("failed", (job, err) => {
    logger.error(`[NotificationWorker] Job failed: ${job?.id}`, err.message);
});
