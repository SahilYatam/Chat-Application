import { notificationDeliveryQueue } from "./notification.queue.js";

type EnqueueNotificationPayload = {
    notificationId: string;
    receiverId: string;
    senderUsername: string;
    type: string;
};

export const enqueueNotificationDelivery = async (
    payload: EnqueueNotificationPayload
) => {
    await notificationDeliveryQueue.add("deliver-notification", payload, {
        /**
         * Deduplication safteguard
         * Prevents accidental duplicate jobs.
         */
        jobId: `notification-${payload.notificationId}`,
    });
};
