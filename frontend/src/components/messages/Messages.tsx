import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { chatThunk } from "../../features/chat/chatThunks";
import { getSocket } from "../../socket/socket";

const Messages = () => {
    const previousHeightRef = useRef(0);
    const isFetchingOlderRef = useRef(false);

    const [typingUserId, setTypingUserId] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const activeConversationId = useAppSelector(
        (state) => state.chat.activeConversationId,
    );

    const currentUserId = useAppSelector((state) => state.auth.user?.id);

    const cursor = useAppSelector((state) =>
        activeConversationId
            ? state.chat.cursorByConversation[activeConversationId]
            : null,
    );

    const socketReady = useAppSelector((state) => state.auth.socketReady);

    const messages = useAppSelector((state) => {
        if (!activeConversationId) return [];

        const convoMessages =
            state.chat.messagesByConversation[activeConversationId];

        return Array.isArray(convoMessages) ? convoMessages : [];
    });

    const handleSroll = () => {
        const el = containerRef.current;

        if (!el) return;

        if (el.scrollTop < 50 && cursor && activeConversationId) {
            isFetchingOlderRef.current = true;
            previousHeightRef.current = el.scrollHeight;

            dispatch(
                chatThunk.getMessages({
                    conversationId: activeConversationId,
                    cursor,
                }),
            );
        }
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // if loading older messages
        if (isFetchingOlderRef.current) {
            const newHeight = el.scrollHeight;
            const heightDiff = newHeight - previousHeightRef.current;

            el.scrollTop = heightDiff;

            isFetchingOlderRef.current = false;
        } else {
            // normal behaviour, scroll to bottom
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const timeout = setTimeout(() => setTypingUserId(null), 0);

        const handleTyping = ({ userId }: { userId: string }) => {
            console.log("Someone Typing: ", userId);

            setTypingUserId(userId);
        };

        const handleStopTyping = () => {
            console.log("Someone Stop Typing");
            setTypingUserId(null);
        };

        socket.on("chat:typing", handleTyping);
        socket.on("chat:stop-typing", handleStopTyping);

        return () => {
            clearTimeout(timeout);
            socket.off("chat:typing", handleTyping);
            socket.off("chat:stop-typing", handleStopTyping);
        };
    }, [socketReady, activeConversationId]);


    return (
        <div
            ref={containerRef}
            onScroll={handleSroll}
            className="px-4 flex-1 overflow-auto"
        >
            {messages.length === 0
                ? null
                : messages.map((msg) => (
                    <Message
                        key={msg.id}
                        id={msg.id}
                        conversationId={msg.conversationId}
                        message={msg.message}
                        createdAt={msg.createdAt}
                        senderId={msg.senderId}
                        read={msg.read}
                    />
                ))}

            {typingUserId && typingUserId !== currentUserId && (
                <div className="text-sm text-black font-bold italic px-2 pb-2">Typing...</div>
            )}
        </div>
    );
};

export default Messages;
