import { Schema, model, Types, HydratedDocument } from "mongoose";

export enum NotificationType {
    FRIEND_REQUEST_RECEIVED = "FRIEND_REQUEST_RECEIVED",
    FRIEND_REQUEST_ACCEPTED = "FRIEND_REQUEST_ACCEPTED",
    FRIEND_REQUEST_REJECTED = "FRIEND_REQUEST_REJECTED",
    MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
}

export interface NotificationSchemaType {
    receiverId: Types.ObjectId;
    senderId?: Types.ObjectId | null;

    type: NotificationType;

    entityId: Types.ObjectId; // friendRequestId | friendshipId | chatId | conversationId

    senderUsername: string;

    isRead: boolean;
    isDelivered: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export type NotificationDocument = HydratedDocument<NotificationSchemaType>;

const notificationSchema = new Schema<NotificationSchemaType>(
    {
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        senderUsername: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },

        entityId: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        isDelivered: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
// Fast fetch unread notification for a user
notificationSchema.index({ receiverId: 1, isRead: 1 });

// Sort notification by newest first
notificationSchema.index({ receiverId: 1, createdAt: -1 });

export const Notification = model<NotificationSchemaType>(
    "Notification",
    notificationSchema
);
