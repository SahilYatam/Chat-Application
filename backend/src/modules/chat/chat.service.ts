import { Types } from "mongoose";
import { chatRepo } from "./chat.repository.js";
import { conversationRepo } from "./conversation.repository.js";
import { friendshipRepo } from "../friendship/friendship.repository.js";
import {
    SendMsgInput,
    MessageData,
    MsgEditParamInput,
    MarkMessagesAsRead,
    MsgEditBodyInput,
    DeleteMsgInput,
    DeleteMsgData,
} from "./chat.type.js";
import { ApiError, normalizeObjectId } from "../../shared/index.js";
import { FriendshipStatus } from "../friendship/friendship.model.js";

const sendMessage = async (senderId: Types.ObjectId, data: SendMsgInput): Promise<MessageData> => {
    const userA = normalizeObjectId(senderId);
    const userB = normalizeObjectId(data.receiverId);

    if (userA.equals(userB)) {
        throw new ApiError(401, "You cannot send a message to yourself");
    }

    const friendship = await friendshipRepo.findFriendshipBetweenUsers(
        userA,
        userB
    );

    if (!friendship) {
        throw new ApiError(
            403,
            "You can only send messages to users you are friends with"
        );
    }

    if (friendship.status !== FriendshipStatus.ACTIVE) {
        throw new ApiError(403, "You cannot send messages to this user");
    }

    const conversation = await conversationRepo.getOrCreateConversation(
        userA,
        userB
    );

    const chat = await chatRepo.createMessage({
        conversationId: conversation._id,
        senderId: userA,
        message: data.message,
    });

    return {
        chatId: chat._id,
        conversationId: chat.conversationId,
        message: chat.message,
        createdAt: chat.createdAt,
    };
};

const markMessagesAsRead = async (
    conversationId: Types.ObjectId | string,
    currentUserId: Types.ObjectId
): Promise<MarkMessagesAsRead> => {
    const updatedCount = await chatRepo.markMessagesAsRead(
        conversationId,
        currentUserId
    );

    return {
        read: true,
        updatedCount,
    };
};

const editMessage = async (
    data: MsgEditParamInput & MsgEditBodyInput, 
    currentUserId: Types.ObjectId,
): Promise<MessageData> => {
    const editMsg = await chatRepo.editMessage(data, currentUserId);

    if (!editMsg) {
        throw new ApiError(404, "Message not found");
    }

    return {
        chatId: editMsg._id,
        conversationId: editMsg.conversationId,
        message: editMsg.message,
        createdAt: editMsg.createdAt,
    };
};

const deleteMessage = async (
    data: DeleteMsgInput,
    currentUserId: Types.ObjectId,
): Promise<DeleteMsgData> => {
    const deletedMsg = await chatRepo.deleteMessage(data, currentUserId);

    if (!deletedMsg) {
        throw new ApiError(
            404,
            "Message not found or you are not allowed to delete it"
        );
    }

    return {
        chatId: deletedMsg._id,
        conversationId: deletedMsg.conversationId,
        message: "This message was deleted",
        createdAt: deletedMsg.createdAt,
        isDeleted: true,
    };
};

export const chatService = {
    sendMessage,
    markMessagesAsRead,
    editMessage,
    deleteMessage,
};
