import { Types, ClientSession } from "mongoose";
import {
    Conversation,
    ConversationSchemaType,
    ConversationDocument,
} from "./conversation.model.js";
import { normalizeObjectId } from "../../shared/index.js";

type ConversationLean = ConversationSchemaType & {
    _id: Types.ObjectId;
};

export type ConversationEntity = {
    id: Types.ObjectId;
    participants: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
};

const getOrCreateConversation = async (
    userA: Types.ObjectId,
    userB: Types.ObjectId,
    session?: ClientSession
): Promise<ConversationDocument> => {
    // 🔒 Enforce canonical order
    const [first, second] =
        userA.toString() < userB.toString() ? [userA, userB] : [userB, userA];

    const conversation = await Conversation.findOneAndUpdate(
        {participants: [first, second]},
        {$setOnInsert: {participants: [first, second]}},
        {
            new: true,
            upsert: true,
            session
        }
    )

    return conversation
};

const findConversationById = async (
    conversationId: Types.ObjectId | string
): Promise<ConversationLean | null> => {
    const id = normalizeObjectId(conversationId);

    return Conversation
        .findById(id)
        .lean<ConversationLean>();
};

const findConversationBetweenUsers = async (
    userA: Types.ObjectId,
    userB: Types.ObjectId
): Promise<ConversationLean | null> => {
    const a = normalizeObjectId(userA);
    const b = normalizeObjectId(userB);

    const [user1, user2] = a.toString() < b.toString() ? [a, b] : [b, a];

    return Conversation.findOne({
        participants: [user1, user2],
    }).lean<ConversationLean>();
};

const getAllConversationsForUser = async (
    userId: Types.ObjectId
): Promise<ConversationLean[]> => {
    return Conversation.find({
        participants: userId,
    })
        .sort({ updatedAt: -1 })
        .lean<ConversationLean[]>();
};

export const conversationRepo = {
    getOrCreateConversation,
    findConversationById,
    findConversationBetweenUsers,
    getAllConversationsForUser,
};
