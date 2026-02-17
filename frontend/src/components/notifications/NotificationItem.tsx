import React from 'react'
import type { Notification } from '../../types';


interface Props {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<Props> = ({ notification, onMarkAsRead }) => {

    const getMessage = () => {
        switch (notification.type) {
            case "FRIEND_REQUEST_RECEIVED":
				return `${notification.senderName ?? "Someone"} sent you a friend request.`;

            case "FRIEND_REQUEST_ACCEPTED":
				return `${notification.senderName ?? "Someone"} accepted your friend request.`;

			case "FRIEND_REQUEST_REJECTED":
				return `${notification.senderName ?? "Someone"} rejected your friend request.`;

			case "MESSAGE_RECEIVED":
				return `New message from ${notification.senderName ?? "Someone"}.`;

			default:
				return "New notification.";
        }
    }

    const baseStyle =
		"p-4 rounded-lg border backdrop-blur-md transition-colors cursor-pointer";

	const unreadStyle = notification.isRead
		? "bg-white/5 border-white/10 text-gray-300"
		: "bg-sky-500/15 border-sky-400/30 text-white";

    return (
        <div className={`${baseStyle} ${unreadStyle}`}
            onClick={() => onMarkAsRead(notification.id)}
        >
            <p className="text-sm">{getMessage()}</p>

            <p className="text-xs opacity-60 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
            </p>
        </div>
    )
}

export default NotificationItem