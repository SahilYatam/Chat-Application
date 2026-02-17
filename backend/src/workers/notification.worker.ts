import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { notificationRepo } from "../modules/notification/notification.respository.js";
import { NOTIFICATION_DELIVERY_QUEUE } from "../queue/notification.queue.js";
import { logger, normalizeObjectId } from "../shared/index.js";
import { emitNotificationToUser, RealtimeNotificationPayload } from "../socket/notification.socket.js";

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
                `[NoficationWroker] Processing job=${job.id}, type=${type}, notificationId=${notificationId}`,
            );

            // Makr delivered
            const notifId = normalizeObjectId(notificationId);
            const receId = normalizeObjectId(receiverId);

            const result = await notificationRepo.markAsDelivered({
                notificationId: notifId,
                receiverId: receId,
            });

            if (!result.delivered) {
                logger.info(
                    `[NotificationWorker] Notification already delivered or not found: ${notificationId}`,
                );
            } else {
                logger.info(
                    `[NotificationWorker] Delivered notification: ${notificationId}`,
                );

                const notification = await notificationRepo.findById(notifId)

                if(notification){
                    const payload: RealtimeNotificationPayload = {
                        notificationId: notification.id,
                        receiverId: notification.receiverId.toString(),
                        type: notification.type,
                        createdAt: notification.createdAt
                    }

                    emitNotificationToUser(payload.receiverId, payload)
                }

            }
            return {
                delivered: true,
            };
        } catch (error) {
            logger.error(
                `[NotificationWroker] Failed job=${job.id}, notificationId=${notificationId}`,
                error,
            );

            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: 5,
    },
);

notificationWorker.on("completed", (job) => {
    logger.info(`[NotificationWorker] Job completed: ${job.id}`);
});

notificationWorker.on("failed", (job, err) => {
    logger.error(`[NotificationWorker] Job failed: ${job?.id}`, err.message);
});
