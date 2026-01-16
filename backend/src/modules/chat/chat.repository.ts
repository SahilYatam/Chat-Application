import { ClientSession, Types } from "mongoose";
import {
    Chat,
    ChatSchemaType,
    ChatDocument,
    MessageType,
} from "./chat.model.js";

type ChatInput = {
    conversationId: Types.ObjectId | string;
    senderId: Types.ObjectId | string;
    message: string;
};

type ChatLean = ChatSchemaType & {
    _id: Types.ObjectId;
};

export type ChatEntity = {
    id: Types.ObjectId;
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    message: string;
    messageType?: MessageType;
    editedAt?: Date;
    read?: boolean;
    isDeleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
};

const returnObj = (chat: ChatLean): ChatEntity => {
    return {
        id: chat._id,
        conversationId: chat.conversationId,
        senderId: chat.senderId,
        message: chat.message,
        messageType: chat.messageType,
        editedAt: chat.editedAt,
        read: chat.read,
        isDeleted: chat.isDeleted,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
    };
};

const createMessage = async (input: ChatInput): Promise<ChatDocument> => {
    return Chat.create({
        conversationId: input.conversationId,
        senderId: input.senderId,
        message: input.message,
        messageType: MessageType.TEXT,
    });
};

const findChatById = async (
    chatId: Types.ObjectId
): Promise<ChatEntity | null> => {
    const chat = await Chat.findById(chatId).lean<ChatLean>();
    if (!chat) return null;

    return returnObj(chat);
};

const findMessagesByConversationId = async (
    conversationId: Types.ObjectId,
    limit = 20,
    cursor?: Types.ObjectId
): Promise<ChatEntity[]> => {
    const query: any = { conversationId };

    // Cursor based pagination, load older messages
    if (cursor) {
        query._id = { $lt: cursor };
    }

    const messages = await Chat.find(query)
        .sort({ _id: -1 }) // newest -> oldest
        .limit(limit)
        .lean();

    return messages.map(returnObj);
};

const markMessagesAsRead = async (
    conversationId: Types.ObjectId,
    currentUserId: Types.ObjectId,
    session?: ClientSession
): Promise<number> => {
    const updatedMsgs = await Chat.updateMany(
        { conversationId, senderId: { $ne: currentUserId }, read: false },
        { $set: { read: true } },
        { session }
    );

    return updatedMsgs.modifiedCount;
};

type EditMsgT = {
    chatId: Types.ObjectId;
    conversationId: Types.ObjectId;
    message: string;
};

type DeleteMsgT = {
    chatId: Types.ObjectId;
    conversationId: Types.ObjectId;
};

const editMessage = async (
    data: EditMsgT,
    currentUserId: Types.ObjectId
): Promise<ChatDocument | null> => {
    return Chat.findOneAndUpdate(
        {
            _id: data.chatId,
            conversationId: data.conversationId,
            senderId: currentUserId,
            isDeleted: false,
        },
        {
            message: data.message,
            editedAt: new Date(),
        },
        { new: true }
    );
};

const deleteMessage = async (
    data: DeleteMsgT,
    currentUserId: Types.ObjectId
): Promise<ChatDocument | null> => {
    return Chat.findOneAndUpdate(
        {
            _id: data.chatId,
            conversationId: data.conversationId,
            senderId: currentUserId,
            isDeleted: false,
        },
        {
            isDeleted: true,
        },
        { new: true }
    );
};

export const chatRepo = {
    findChatById,
    createMessage,
    findMessagesByConversationId,
    markMessagesAsRead,
    editMessage,
    deleteMessage,
};
