export type NotificationType =
	| "FRIEND_REQUEST_RECEIVED"
	| "FRIEND_REQUEST_ACCEPTED"
	| "FRIEND_REQUEST_REJECTED"
	| "MESSAGE_RECEIVED";

export interface AppNotification {
    id: string;

    receiverId: string;
    senderId?: string | null;

    type: NotificationType;
    entityId: string;

    isRead: boolean;
    isDelivered: boolean;

    createdAt: string;
    updatedAt: string;

    senderName?: string;
}
