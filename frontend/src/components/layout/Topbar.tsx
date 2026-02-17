import { useState, useRef, useEffect } from "react";
import NotificationPanel from "../notifications/NotificationPanel";
import type { AppNotification } from "../../types";

const Topbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const notifications: AppNotification[] = [];

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

    return (
        <div className="relative flex items-center justify-end p-4 border-b border-white/10">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="text-white hover:text-sky-400 transition-colors cursor-pointer"
            >
                🔔
            </button>

            {isOpen && (
                <div ref={panelRef}>
                    <NotificationPanel
                        notifications={notifications}
                        onMarkAsRead={(id) => console.log(id)}
                    />
                </div>
            )}
        </div>
    );
};

export default Topbar;
