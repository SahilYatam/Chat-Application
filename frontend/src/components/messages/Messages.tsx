import { useAppSelector } from "../../store/hooks";
import Message from "./Message";

const Messages = () => {
    const activeConversationId = useAppSelector(
        (state) => state.chat.activeConversationId
    );

    const messages = useAppSelector((state) => {
        if (!activeConversationId) return [];

        const convoMessages =
            state.chat.messagesByConversation[activeConversationId];

        return Array.isArray(convoMessages) ? convoMessages : [];
    });

    return (
        <div className="px-4 flex-1 overflow-auto">
            {messages.length === 0 ? null : (
                messages.map((msg) => (
                    <Message
                        key={msg.id}
                        id={msg.id}
                        conversationId={msg.conversationId}
                        message={msg.message}
                        createdAt={msg.createdAt}
                        senderId={msg.senderId}
                        read={msg.read}
                    />
                ))
            )}
        </div>
    );
};

export default Messages;