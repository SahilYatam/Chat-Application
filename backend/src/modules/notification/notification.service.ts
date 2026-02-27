import { Types } from "mongoose";
import { ApiError, normalizeObjectId } from "../../shared/index.js";
import { NotificationType } from "./notification.model.js";
import {
    notificationRepo,
    NotificationCursor,
    GetUserNotificationsResult,
} from "./notification.respository.js";
import { enqueueNotificationDelivery } from "../../queue/notification.producer.js";
import { MarkAsReadInput } from "./notification.type.js";

type CreateNotificationInput = {
    receiverId: Types.ObjectId;
    senderId: Types.ObjectId;
    type: NotificationType;
    entityId: Types.ObjectId;
    senderUsername: string;
};

const createAndDispatch = async (input: CreateNotificationInput) => {
    // 1. Normalize IDs
    const targetUserId = normalizeObjectId(input.receiverId);
    const currentUserId = normalizeObjectId(input.senderId);
    const entId = normalizeObjectId(input.entityId);

    // 2. Persist notification 
    const notification = await notificationRepo.createNotification({
        receiverId: targetUserId,
        senderId: currentUserId ?? null,
        type: input.type,
        entityId: entId,
        senderUsername: input.senderUsername,
        isDelivered: false
    });

    // 3. Enqueue delivery job
    await enqueueNotificationDelivery({
        notificationId: notification.id,
        receiverId: input.receiverId.toString(),
        type: input.type,
        senderUsername: input.senderUsername
    });

    return notification;
};

const getUserNotifications = async (
    receiverId: Types.ObjectId,
    limit = 20,
    cursor?: NotificationCursor,
): Promise<GetUserNotificationsResult> => {

    const notifications = await notificationRepo.getUserNotifications(
        receiverId,
        limit,
        cursor,
    );

    return notifications
};

const notificationMarkAsRead = async (
    input: MarkAsReadInput
) => {
    const notification = await notificationRepo.markAsRead({
        notificationId: input.notificationId,
        receiverId: input.receiverId
    });

    if(notification.count === 0){
        throw new ApiError(404, "Notification not found or already read");
    }

    return {
        success: true,
        updated: notification.read,
    };
};

const deleteNotification = async (
    notificationId: Types.ObjectId,
    receiverId: Types.ObjectId,
) => {
    const notifId = normalizeObjectId(notificationId);
    const userId = normalizeObjectId(receiverId);

    const deleted = await notificationRepo.deleteNotification(notifId, userId);

    if (!deleted) {
        throw new ApiError(404, "Notification not found");
    }

    return deleted;
};

export const notificationService = {
    createAndDispatch,
    getUserNotifications,
    notificationMarkAsRead,
    deleteNotification,
};
