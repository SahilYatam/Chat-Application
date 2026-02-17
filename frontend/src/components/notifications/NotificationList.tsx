import React from 'react'
import type { AppNotification } from "../../types/index";
import NotificationItem from "./NotificationItem";

interface Props {
    notifications: AppNotification[];
    onMarkAsRead: (id: string) => void;
}


const NotificationList: React.FC<Props> = ({
    notifications,
    onMarkAsRead
}) => {

    if(!notifications.length){
        return (
            <div className="text-center text-white p-6">
                No notifications
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {notifications.map((n) => (
                <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkAsRead={onMarkAsRead}
                />
            ))}
        </div>
  )
}

export default NotificationList