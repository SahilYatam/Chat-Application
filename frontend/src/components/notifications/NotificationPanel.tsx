import NotificationList from "./NotificationList";
import type { NotificationUIProps } from "./notification-ui.types";

const NotificationPanel = ({
    notifications,
    onNotificationClick,
    onDelete
}: NotificationUIProps) => {
    return (
        <div className="absolute right-0 top-12 w-96 max-h-[500px] overflow-y-auto no-scrollbar bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl">
            <h2 className="text-white font-semibold mb-4">Notifications</h2>

            <NotificationList
                notifications={notifications}
                onNotificationClick={onNotificationClick}
                onDelete={onDelete}
            />
        </div>
    );
};

export default NotificationPanel;