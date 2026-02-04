import { Types } from "mongoose";
import {
    Notification,
    NotificationType,
} from "./notification.model.js";
import { MarkAsDeliverdOutput, MarkAsReadInput, MarkAsReadOutput } from "./notification.type.js";

type CreateNotificationInput = {
    receiverId: Types.ObjectId | string;
    type: NotificationType;
    entityId: Types.ObjectId | string;
    senderId?: Types.ObjectId | null;
};

export type NotificationEntity = {
    id: string;
    receiverId: Types.ObjectId;
    entityId: Types.ObjectId;
    type: NotificationType;
    senderId: Types.ObjectId | null | undefined;
    isRead: boolean;
    isDelivered: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type NotificationCursor = {
    createdAt: Date;
    id: Types.ObjectId;
};

export type GetUserNotificationsResult = {
    notifications: NotificationEntity[];
    nextCursor: NotificationCursor | null;
    hasMore: boolean;
};

const returnObj = (obj: any) => {
    return {
        id: obj._id.toString(),
        receiverId: obj.receiverId,
        entityId: obj.entityId,
        type: obj.type,
        senderId: obj.senderId ?? null,
        isRead: obj.isRead,
        isDelivered: obj.isDelivered,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
    };
};

const createNotification = async (
    input: CreateNotificationInput
): Promise<NotificationEntity> => {
    const doc = await Notification.create({
        receiverId: input.receiverId,
        entityId: input.entityId,
        type: input.type,
        senderId: input.senderId ?? null,
    });

    const obj = doc.toObject();

    return returnObj(obj);
};

const createManyNotifications = async (
    input: CreateNotificationInput[]
): Promise<NotificationEntity[]> => {
    if (input.length === 0) return [];

    const docs = await Notification.insertMany(
        input.map((input) => ({
            receiverId: input.receiverId,
            entityId: input.entityId,
            type: input.type,
            senderId: input.senderId ?? null,
        })),
        { ordered: true }
    );

    return docs.map((doc) => {
        const obj = doc.toObject();

        return returnObj(obj);
    });
};

const MAX_LIMIT = 50;

const getUserNotifications = async (
    receiverId: Types.ObjectId,
    limit = 20,
    cursor?: NotificationCursor
): Promise<GetUserNotificationsResult> => {
    const safeLimit = Math.min(limit, MAX_LIMIT);

    const query: Record<string, any> = {
        receiverId,
    };

    // Cursor-based pagination
    if (cursor) {
        query.$or = [
            { createdAt: { $lt: cursor.createdAt } },
            {
                createdAt: cursor.createdAt,
                _id: { $lt: cursor.id },
            },
        ];
    }

    // Fetch one extra recode detect hasMore
    const docs = await Notification.find(query)
        .sort({ createdAt: -1, _id: -1 }) // deterministic ordering
        .limit(safeLimit + 1)
        .lean();

    const hasMore = docs.length > safeLimit;
    const slicedDocs = hasMore ? docs.slice(0, safeLimit) : docs;

    const notifications: NotificationEntity[] = slicedDocs.map((obj) =>
        returnObj(obj)
    );

    const last = slicedDocs[slicedDocs.length - 1];

    const nextCursor: NotificationCursor | null = last
        ? {
            createdAt: last.createdAt,
            id: last._id,
        }
        : null;

    return {
        notifications,
        nextCursor,
        hasMore,
    };
};

const markAsRead = async (
    input: MarkAsReadInput
): Promise<MarkAsReadOutput> => {
    const result = await Notification.updateOne(
        { _id: input.notificationId, receiverId: input.receiverId, isRead: false },
        { $set: { isRead: true } }
    );
    return {
        read: result.modifiedCount === 1,
        count: result.modifiedCount,
    };
};

const markManyAsRead = async (receiverId: Types.ObjectId): Promise<number> => {
    const markedCount = await Notification.updateMany(
        { receiverId, isRead: false },
        { $set: { isRead: true } }
    );
    return markedCount.modifiedCount;
};

const getUnreadCount = async (receiverId: Types.ObjectId): Promise<number> => {
    return Notification.countDocuments({
        receiverId,
        isRead: false,
    });
};


const markAsDelivered = async (
    input: MarkAsReadInput
): Promise<MarkAsDeliverdOutput> => {
    const result = await Notification.updateOne(
        {
            _id: input.notificationId,
            receiverId: input.receiverId,
            isDelivered: false,
        },
        { $set: { isDelivered: true } }
    );
    return {
        delivered: result.modifiedCount === 1,
        count: result.modifiedCount,
    };
};

const deleteNotification = async (
    notificationId: Types.ObjectId,
    receiverId: Types.ObjectId
): Promise<number> => {
    const result = await Notification.deleteOne({
        _id: notificationId,
        receiverId,
    });
    return result.deletedCount ?? 0;
};

export const notificationRepo = {
    createNotification,
    createManyNotifications,
    getUserNotifications,
    markAsRead,
    markManyAsRead,
    getUnreadCount,
    markAsDelivered,
    deleteNotification,
};
