import React from 'react'
import NotificationItem from "./NotificationItem";

import type { NotificationUIProps } from './notification-ui.types';

const NotificationList: React.FC<NotificationUIProps> = ({
    notifications,
    onNotificationClick,
    onDelete
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
                    key={n.id ?? `${n.type}-${n.entityId}-${n.createdAt}`}
                    notification={n}
                    onNotificationClick={onNotificationClick}
                    onDelete={onDelete}
                />
            ))}
        </div>
  )
}

export default NotificationList