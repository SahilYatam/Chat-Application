import { useState, useRef, useEffect } from "react";
import NotificationPanel from "../notifications/NotificationPanel";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { notificationThunks } from "../../features/notification/notification.thunks";
import {
    markAsReadLocal,
    notificationClicked,
    removeNotificationLocal,
} from "../../features/notification/notification.slices";
import { setSelectedUser } from "../../features/chat/chatSlices";
import type { AppNotification } from "../../types";

const Topbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useAppDispatch();

    const notifications = useAppSelector((state) => state.notification.items);
    const unreadCount = useAppSelector((state) => state.notification.unreadCount);

    // Fetch on mount
    useEffect(() => {
        dispatch(notificationThunks.fetchNotifications());
    }, [dispatch]);

    // Close panel on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const onNotificationClick = (notif: AppNotification) => {
        // Opstimistic update instantly and then sync with backend
        dispatch(markAsReadLocal(notif.id));
        dispatch(notificationThunks.markNotificationAsRead(notif.id));
        dispatch(
            notificationClicked({
                type: notif.type,
                entityId: notif.entityId,
                senderUsername: notif.senderUsername,
            }),
        );

        if(notif.senderId){
            dispatch(setSelectedUser(notif.senderId))
        }

        setIsOpen(false);
    };

    const onDeleteNotification = (id: string) => {
        // optimistic UI
        dispatch(removeNotificationLocal(id))

        // backend sync
        dispatch(notificationThunks.deleteNotification(id))
    }

    return (
        <div className="relative flex items-center justify-end p-4 border-b border-white/10">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="text-white hover:text-sky-400 transition-colors cursor-pointer"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="absolute top-3.5 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div ref={panelRef}>
                    <NotificationPanel
                        notifications={notifications}
                        onNotificationClick={onNotificationClick}
                        onDelete={onDeleteNotification}
                    />
                </div>
            )}
        </div>
    );
};

export default Topbar;
