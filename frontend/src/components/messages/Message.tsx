import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { extractTime } from "../../utils/extractTime";
import { chatThunk } from "../../features/chat/chatThunks";

import { Check, CheckCheck, X } from "lucide-react";

interface MessageFormat {
    id: string;
    conversationId: string;
    message: string;
    createdAt: string;
    senderId: string;
    read: boolean;
}

const Message = ({
    id,
    conversationId,
    message,
    createdAt,
    senderId,
    read,
}: MessageFormat) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message);
    const [showMenu, setShowMenu] = useState(false);

    const panelRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useAppDispatch();

    const currentUserId = useAppSelector((state) => state.user.user?.id);
    const isSender = String(currentUserId) === String(senderId);

    const handleSave = async () => {
        if (!editedMessage.trim()) return;

        await dispatch(
            chatThunk.editMessage({
                chatId: id,
                conversationId,
                message: editedMessage,
            }),
        );

        setIsEditing(false);
    };

    const handleDelete = async () => {
        await dispatch(
            chatThunk.deleteMessage({
                chatId: id,
                conversationId,
            }),
        );

        setShowMenu(false);
    };

    useEffect(() => {
        if (!isSender && !read) {
            dispatch(chatThunk.markMessagesAsRead({ conversationId }));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    return (
        <div
            className={`w-full flex p-2 mb-2 ${isSender ? "justify-end" : "justify-start"
                }`}
        >
            <div
                ref={panelRef}
                className="flex flex-col max-w-xs md:max-w-md relative group"
            >
                <div
                    className={`px-4 py-2 rounded-2xl text-sm md:text-base shadow-md relative ${isSender
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                >
                    {isEditing ? (
                        <div className="flex gap-2">
                            <input
                                value={editedMessage}
                                onChange={(e) => setEditedMessage(e.target.value)}
                                className="px-2 py-1 rounded text-black"
                            />
                            <button onClick={handleSave} className="text-white">
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-white"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        message
                    )}

                    {/* THREE DOTS */}
                    {isSender && !isEditing && (
                        <button
                            onClick={() => setShowMenu((prev) => !prev)}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                            ⋮
                        </button>
                    )}

                    {/* DROPDOWN MENU */}
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-24 bg-white text-black rounded shadow-lg z-10">
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setShowMenu(false);
                                }}
                                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                            >
                                Edit
                            </button>

                            <button
                                onClick={handleDelete}
                                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-500 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* TIME */}
                <span
                    className={`text-xs mt-1 flex items-center gap-1 justify-end
                        ${isSender
                            ? "text-right text-gray-300"
                            : "text-left text-gray-300 w-15"
                        }`}
                >
                    {extractTime(createdAt)}

                    {isSender &&
                        (read ? (
                            <CheckCheck size={15} className="text-blue-400" />
                        ) : (
                            <Check size={15} />
                        ))}
                </span>
            </div>
        </div>
    );
};

export default Message;
