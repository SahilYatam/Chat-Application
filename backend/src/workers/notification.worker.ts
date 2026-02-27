import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { notificationRepo } from "../modules/notification/notification.respository.js";
import { NOTIFICATION_DELIVERY_QUEUE } from "../queue/notification.queue.js";
import { logger, normalizeObjectId } from "../shared/index.js";
import { RealtimeNotificationPayload } from "../socket/notification.socket.js";

type NotificationJobPayload = {
    notificationId: string;
    receiverId: string;
    entityId: string;
    senderUsername: string;
    type: string;
};

type NotificationWorkerResult = {
    delivered: boolean;
    payload: RealtimeNotificationPayload | null;
};

export const notificationWorker = new Worker<
    NotificationJobPayload,
    NotificationWorkerResult
>(
    NOTIFICATION_DELIVERY_QUEUE,
    async (job: Job<NotificationJobPayload>) => {
        const { notificationId, receiverId, type } = job.data;

        // --- Defensive validation ---
        if (!notificationId || !receiverId || !type) {
            throw new Error("Invalid notification job payload");
        }

        try {
            logger.info(
                `[NotificationWorker] Processing job=${job.id}, type=${type}, notificationId=${notificationId}`,
            );

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

                return {
                    delivered: false,
                    payload: null,
                };
            }

            logger.info(
                `[NotificationWorker] Delivered notification: ${notificationId}`,
            );

            const notification = await notificationRepo.findById(notifId);

            if (!notification) {
                return {
                    delivered: true,
                    payload: null,
                };
            }

            const payload: RealtimeNotificationPayload = {
                notificationId: notification.id,
                receiverId: notification.receiverId.toString(),
                entityId: notification.entityId.toString(),
                type: notification.type,
                senderUsername: notification.senderUsername,
                createdAt: notification.createdAt,
            };

            return {
                delivered: true,
                payload,
            };
        } catch (error) {
            logger.error(
                `[NotificationWorker] Failed job=${job.id}, notificationId=${notificationId}`,
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
