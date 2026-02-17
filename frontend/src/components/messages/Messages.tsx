import { useAppSelector } from "../../store/hooks";
import Message from "./Message";

const Messages = () => {
    const activeConversationId = useAppSelector(
        (state) => state.chat.activeConversationId
    )

    const message = useAppSelector((state) => 
        activeConversationId 
        ? state.chat.messagesByConversation[activeConversationId] ?? []
        : []
    )

	return (
		<div className='px-4 flex-1 overflow-auto'>
			{message.map((msg) => (
                <Message
                    key={msg.chatId}
                    message={msg.message}
                    createdAt={msg.createdAt}
                />
            ))}
		</div>
	);
};
export default Messages;
