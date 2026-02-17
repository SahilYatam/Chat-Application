import type { AppNotification } from "../../types";
import NotificationList from "./NotificationList";


const NotificationPanel = ({
    notifications,
    onMarkAsRead,
}: {
    notifications: AppNotification[];
    onMarkAsRead: (id: string) => void;
}) => {
    return (
        <div className="absolute right-0 top-12 w-96 max-h-[500px] overflow-y-auto no-scrollbar bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl">
            <h2 className="text-white font-semibold mb-4">Notifications</h2>

            <NotificationList
                notifications={notifications}
                onMarkAsRead={onMarkAsRead}
            />
        </div>
    );
};

export default NotificationPanel;

// const markAsRead = async (id: string) => {
// 	// Call backend API
// 	await fetch(`/api/notifications/${id}/read`, {
// 		method: "PATCH",
// 	});

// 	// Update state
// 	setNotifications((prev) =>
// 		prev.map((n) =>
// 			n._id === id ? { ...n, isRead: true } : n
// 		)
// 	);
// };
