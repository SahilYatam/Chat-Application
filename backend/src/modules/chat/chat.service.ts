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
import { ApiError, logger, normalizeObjectId } from "../../shared/index.js";
import { FriendshipStatus } from "../friendship/friendship.model.js";
import { NotificationType } from "../notification/notification.model.js";
import { notificationService } from "../notification/notification.service.js";

const sendMessage = async (
    senderId: Types.ObjectId,
    data: SendMsgInput
): Promise<MessageData> => {
    const userA = normalizeObjectId(senderId);
    const userB = normalizeObjectId(data.receiverId);

    // 1. Prevent self message
    if (userA.equals(userB)) {
        throw new ApiError(400, "You cannot send a message to yourself");
    }

    // 2. Friendship validation
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

    // 3. Resolve conversation
    const conversation = await conversationRepo.getOrCreateConversation(
        userA,
        userB
    );

    // 4. Persis message
    const chat = await chatRepo.createMessage({
        conversationId: conversation._id,
        senderId: userA,
        message: data.message,
    });

    // 5, Fire notification (non-blocking side effect)
    await notificationService
        .createAndDispatch({
            receiverId: userB,
            senderId: userA,
            type: NotificationType.MESSAGE_RECEIVED,
            entityId: chat._id,
        })
        .catch((err) => {
            logger.error("[sendMessage] Failed to dispatch notification"), err;
        });

    return {
        chatId: chat._id,
        conversationId: chat.conversationId,
        message: chat.message,
        createdAt: chat.createdAt,
    };
};

const markMessagesAsRead = async (
    conversationId: Types.ObjectId,
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
    currentUserId: Types.ObjectId
): Promise<MessageData> => {
    const normalizedInput = {
        ...data,
        chatId: normalizeObjectId(data.chatId),
        conversationId: normalizeObjectId(data.conversationId),
    };
    const editMsg = await chatRepo.editMessage(normalizedInput, currentUserId);

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
    currentUserId: Types.ObjectId
): Promise<DeleteMsgData> => {
    const normalizedInput = {
        chatId: normalizeObjectId(data.chatId),
        conversationId: normalizeObjectId(data.conversationId),
    };
    const deletedMsg = await chatRepo.deleteMessage(
        normalizedInput,
        currentUserId
    );

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

const getMessageById = async (
    chatId: Types.ObjectId,
    currentUserId: Types.ObjectId
): Promise<MessageData> => {
    const normalizedChatId = normalizeObjectId(chatId);

    const message = await chatRepo.findChatById(normalizedChatId);
    if (!message) throw new ApiError(404, "Message not found");

    // Authorization: ensure user belongs to the conversation
    const conversation = await conversationRepo.findConversationById(
        message.conversationId
    );

    if (!conversation) throw new ApiError(404, "Conversation not found");

    const isParticipant = conversation.participants.some((userId) => {
        userId.equals(currentUserId);
    });

    if (!isParticipant) {
        throw new ApiError(403, "You are not allowed to access this message");
    }

    return {
        chatId: message.id,
        conversationId: message.conversationId,
        message: message.message,
        createdAt: message.createdAt,
    };
};

const getAllConversationMessages = async (
    conversationId: Types.ObjectId | string,
    currentUserId: Types.ObjectId,
    limit = 20,
    cursor?: Types.ObjectId | string
): Promise<MessageData[]> => {
    const normalizedConversationId = normalizeObjectId(conversationId);
    const normalizedCursor = cursor ? normalizeObjectId(cursor) : undefined;

    const conversation = await conversationRepo.findConversationById(
        normalizedConversationId
    );

    if (!conversation) throw new ApiError(404, "Conversation not found");

    const isParticipant = conversation.participants.some((userId) => {
        userId.equals(currentUserId);
    });

    if (!isParticipant) {
        throw new ApiError(403, "You are not allowed to access this message");
    }

    const messages = await chatRepo.findMessagesByConversationId(
        normalizedConversationId,
        limit,
        normalizedCursor
    );

    return messages.map((msg) => ({
        chatId: msg.id,
        conversationId: msg.conversationId,
        message: msg.message,
        createdAt: msg.createdAt,
    }));
};

export const chatService = {
    sendMessage,
    markMessagesAsRead,
    editMessage,
    deleteMessage,
    getMessageById,
    getAllConversationMessages
};
