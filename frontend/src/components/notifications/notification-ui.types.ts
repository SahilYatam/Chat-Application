import type { AppNotification } from "../../types";

export interface NotificationUIProps {
    notifications: AppNotification[];
    onNotificationClick: (notification: AppNotification) => void;
    onDelete: (id: string) => void;
}