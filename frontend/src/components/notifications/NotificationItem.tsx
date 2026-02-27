import React from "react";
import type { AppNotification } from "../../types";
import { X } from "lucide-react";

interface Props {
    notification: AppNotification;
    onNotificationClick: (notification: AppNotification) => void;
    onDelete: (id: string) => void;
}

const NotificationItem: React.FC<Props> = ({
    notification,
    onNotificationClick,
    onDelete
}) => {
    const getMessage = () => {
        switch (notification.type) {
            case "FRIEND_REQUEST_RECEIVED":
                return `${notification.senderUsername ?? "Someone"} sent you a friend request.`;

            case "FRIEND_REQUEST_ACCEPTED":
                return `${notification.senderUsername ?? "Someone"} accepted your friend request.`;

            case "FRIEND_REQUEST_REJECTED":
                return `${notification.senderUsername ?? "Someone"} rejected your friend request.`;

            case "MESSAGE_RECEIVED":
                return `New message from ${notification.senderUsername ?? "Someone"}.`;

            default:
                return "New notification.";
        }
    };

    const baseStyle =
        "p-4 rounded-lg border backdrop-blur-md transition-colors cursor-pointer";

    const unreadStyle = notification.isRead
        ? "bg-white/5 border-white/10 text-gray-300"
        : "bg-sky-500/15 border-sky-400/30 text-white";

    return (
        <div
            className={`${baseStyle} ${unreadStyle}`}
            onClick={() => onNotificationClick(notification)}
        >
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id)
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-400 transition"
            >
                <X size={14}/>
            </button>

            <p className="text-sm">{getMessage()}</p>

            <p className="text-xs opacity-60 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
            </p>
        </div>
    );
};

export default NotificationItem;
