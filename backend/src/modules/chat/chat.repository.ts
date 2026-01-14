import { ClientSession, Types } from "mongoose";
import {
    Chat,
    ChatSchemaType,
    ChatDocument,
    MessageType,
} from "./chat.model.js";
import { normalizeObjectId } from "../../shared/index.js";

const findChatById = async (
    chatId: Types.ObjectId
): Promise<ChatSchemaType | null> => {
    const id = normalizeObjectId(chatId);
    return Chat.findById(id).lean<ChatSchemaType>();
};

type ChatInput = {
    conversationId: Types.ObjectId | string;
    senderId: Types.ObjectId | string;
    message: string;
};

const createMessage = async (input: ChatInput): Promise<ChatDocument> => {
    return Chat.create({
        conversationId: input.conversationId,
        senderId: input.senderId,
        message: input.message,
        messageType: MessageType.TEXT,
    });
};

const findMessagesByConversationId = async (
    conversationId: Types.ObjectId,
    limit = 20,
    cursor?: Types.ObjectId
): Promise<ChatSchemaType[]> => {
    const id = normalizeObjectId(conversationId);

    const query: any = { conversationId: id };

    // Cursor based pagination, load older messages
    if (cursor) {
        query._id = { $lt: cursor };
    }

    const messages = await Chat.find(query)
        .sort({ _id: -1 }) // newest -> oldest
        .limit(limit)
        .lean();

    return messages;
};

const markMessagesAsRead = async (
    conversationId: Types.ObjectId | string,
    currentUserId: Types.ObjectId | string,
    session?: ClientSession
): Promise<number> => {
    const id = normalizeObjectId(conversationId);
    const currUserId = normalizeObjectId(currentUserId);

    const updatedMsgs = await Chat.updateMany(
        { conversationId: id, senderId: { $ne: currUserId }, read: false },
        { $set: { read: true } },
        { session }
    );

    return updatedMsgs.modifiedCount;
};

type EditMsgT = {
    chatId: Types.ObjectId | string;
    conversationId: Types.ObjectId | string;
    message: string;
};

type DeleteMsgT = {
    chatId: Types.ObjectId | string;
    conversationId: Types.ObjectId | string;
};

const editMessage = async (
    data: EditMsgT,
    currentUserId: Types.ObjectId | string
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
    currentUserId: Types.ObjectId | string
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
