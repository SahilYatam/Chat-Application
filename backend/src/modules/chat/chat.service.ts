import mongoose, { Types } from "mongoose";
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
    GetMessagesInput,
    GetMessagesResponse,
} from "./chat.type.js";
import { ApiError, logger, normalizeObjectId } from "../../shared/index.js";
import { FriendshipStatus } from "../friendship/friendship.model.js";
import { NotificationType } from "../notification/notification.model.js";
import { notificationService } from "../notification/notification.service.js";
import { io } from "../../socket/socket.js";

const sendMessage = async (
    senderId: Types.ObjectId,
    data: SendMsgInput,
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
        userB,
    );

    if (!friendship) {
        throw new ApiError(
            403,
            "You can only send messages to users you are friends with",
        );
    }

    if (friendship.status !== FriendshipStatus.ACTIVE) {
        throw new ApiError(403, "You cannot send messages to this user");
    }

    let chat: Awaited<ReturnType<typeof chatRepo.createMessage>>;

    // Transation
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 3. Resolve conversation
        const conversation = await conversationRepo.getOrCreateConversation(
            userA,
            userB,
            session,
        );

        // 4. Persis message
        chat = await chatRepo.createMessage(
            {
                conversationId: conversation._id,
                senderId: userA,
                message: data.message,
            },
            session,
        );

        await session.commitTransaction();
    } catch (err: unknown) {
        const error = err as Error;
        await session.abortTransaction();
        logger.error("Error while sending message", error.message, error.stack);
        throw error;
    } finally {
        session.endSession();
    }

    if (!chat) {
        throw new Error("Invariant violation: chat not created");
    }

    // 5. Real time socket delivery
    const receiverRoom = `user:${userB.toString()}`;

    try {
        io.to(receiverRoom).emit("chat:message", {
            chatId: chat._id,
            conversationId: chat.conversationId,
            senderId: userA,
            message: chat.message,
            createdAt: chat.createdAt,
        });
    } catch (err) {
        logger.warn("[sendMessage] Socket emit failed", { err });
    }

    // 6. Fire notification (non-blocking side effect)
    notificationService
        .createAndDispatch({
            receiverId: userB,
            senderId: userA,
            type: NotificationType.MESSAGE_RECEIVED,
            entityId: chat._id,
        })
        .catch((err) => {
            (logger.error("[sendMessage] Failed to dispatch notification"), err);
        });

    return {
        chatId: chat._id,
        conversationId: chat.conversationId,
        message: chat.message,
        createdAt: chat.createdAt,
    };
};

const getMessages = async (
    currentUserId: Types.ObjectId,
    { conversationId, limit = 20, cursor }: GetMessagesInput,
): Promise<GetMessagesResponse> => {
    const normalizedConverId = normalizeObjectId(conversationId);

    // 1. Checking if conversation exists or not
    const conversation =
        await conversationRepo.findConversationById(conversationId);
    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    // 2. Verify user is part of this coverstion
    const isParticipant = conversation.participants.some(
        (id) => id.toString() === currentUserId.toString(),
    );
    if (!isParticipant) {
        throw new ApiError(403, "You are not allowed to access this conversation");
    }

    // 3. Fetching messages (newest -> oldest)
    const messages = await chatRepo.findMessagesByConversationId(
        normalizedConverId,
        limit,
        cursor,
    );

    // 4. Mark user's messages as read
    await chatRepo.markMessagesAsRead(normalizedConverId, currentUserId);

    // 5. oldest -> newest messages, Reverse for ui
    const orderMessages = messages.reverse();

    const nextCursor =
        messages.length === limit ? messages[messages.length - 1].id : null;

    return {
        messages: orderMessages,
        nextCursor,
    };
};

const markMessagesAsRead = async (
    conversationId: Types.ObjectId,
    currentUserId: Types.ObjectId,
): Promise<MarkMessagesAsRead> => {
    const updatedCount = await chatRepo.markMessagesAsRead(
        conversationId,
        currentUserId,
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
    const normalizedInput = {
        ...data,
        chatId: normalizeObjectId(data.chatId),
        conversationId: normalizeObjectId(data.conversationId),
    };
    const editMsg = await chatRepo.editMessage(normalizedInput, currentUserId);

    if (!editMsg) {
        throw new ApiError(404, "Message not found");
    }

    try {
        const conversation = await conversationRepo.findConversationById(
            editMsg.conversationId,
        );

        if (conversation) {
            for (const participantId of conversation.participants) {
                io.to(`user:${participantId.toString()}`).emit("chat:message-edited", {
                    chatId: editMsg._id,
                    conversationId: editMsg.conversationId,
                    message: editMsg.message,
                    updatedAt: editMsg.updatedAt,
                });
            }
        }
    } catch (err) {
        logger.warn("[editMessage] Socket emit failed", { err });
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
    const normalizedInput = {
        chatId: normalizeObjectId(data.chatId),
        conversationId: normalizeObjectId(data.conversationId),
    };
    const deletedMsg = await chatRepo.deleteMessage(
        normalizedInput,
        currentUserId,
    );

    if (!deletedMsg) {
        throw new ApiError(
            404,
            "Message not found or you are not allowed to delete it",
        );
    }

    try {
        const conversation = await conversationRepo.findConversationById(
            deletedMsg.conversationId,
        );

        if (conversation) {
            for (const participantId of conversation.participants) {
                io.to(`user:${participantId.toString()}`).emit("chat:message-deleted", {
                    chatId: deletedMsg._id,
                    conversationId: deletedMsg.conversationId,
                });
            }
        }
    } catch (err) {
        logger.warn("[deleteMessage] Socket emit failed", { err });
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
    currentUserId: Types.ObjectId,
): Promise<MessageData> => {
    const normalizedChatId = normalizeObjectId(chatId);

    const message = await chatRepo.findChatById(normalizedChatId);
    if (!message) throw new ApiError(404, "Message not found");

    // Authorization: ensure user belongs to the conversation
    const conversation = await conversationRepo.findConversationById(
        message.conversationId,
    );

    if (!conversation) throw new ApiError(404, "Conversation not found");

    const isParticipant = conversation.participants.some(
        (id) => id.toString() === currentUserId.toString(),
    );

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

export const chatService = {
    sendMessage,
    getMessages,
    markMessagesAsRead,
    editMessage,
    deleteMessage,
    getMessageById,
};
