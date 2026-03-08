import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useEffect, useRef } from "react";
import Message from "./Message";
import { chatThunk } from "../../features/chat/chatThunks";

const Messages = () => {
    const previousHeightRef = useRef(0);
    const isFetchingOlderRef = useRef(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const activeConversationId = useAppSelector(
        (state) => state.chat.activeConversationId,
    );

    const cursor = useAppSelector((state) =>
        activeConversationId
            ? state.chat.cursorByConversation[activeConversationId]
            : null,
    );

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
        if(!el) return;

        // if loading older messages
        if(isFetchingOlderRef.current){
            const newHeight = el.scrollHeight;
            const heightDiff = newHeight - previousHeightRef.current;

            el.scrollTop = heightDiff

            isFetchingOlderRef.current = false
        } else {
            // normal behaviour, scroll to bottom
            el.scrollTop = el.scrollHeight;
        }


    }, [messages]);

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
        </div>
    );
};

export default Messages;
