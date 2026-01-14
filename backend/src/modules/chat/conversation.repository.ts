import { Types } from "mongoose";
import { Conversation,  ConversationSchemaType, ConversationDocument} from "./conversation.model.js";
import { normalizeObjectId } from "../../shared/index.js";


const getOrCreateConversation = async (
    userA: Types.ObjectId,
    userB: Types.ObjectId
): Promise<ConversationDocument> => {

    // 🔒 Enforce canonical order
    const [first, second] =
        userA.toString() < userB.toString()
            ? [userA, userB]
            : [userB, userA];

    const existingConversation = await Conversation.findOne({
        participants: [first, second],
    });

    if (existingConversation) {
        return existingConversation;
    }

    return Conversation.create({
        participants: [first, second],
    });
};

const findConversationById = async (
    conversationId: Types.ObjectId | string
): Promise<ConversationSchemaType | null> => {
    const id = normalizeObjectId(conversationId);
    return Conversation.findById(id).lean<ConversationSchemaType>();
};

const findConverBetweenUsers = async (
    userA: Types.ObjectId,
    userB: Types.ObjectId
): Promise<ConversationSchemaType | null> => {
    const a = normalizeObjectId(userA);
    const b = normalizeObjectId(userB);

    const [user1, user2] = a.toString() < b.toString() ? [a, b] : [b, a];

    return await Conversation.findOne({
        participants: [user1, user2],
    }).lean<ConversationSchemaType>();
};

// const deleteConverstation = async (
//     userId: Types.ObjectId
// ): Promise<ConversationSchemaType | null> => {
//     const id = normalizeObjectId(userId);
//     await Conversation.deleteOne({
//         participants: [id]
//     });
// }

const getAllConversationsForUser = async (
    userId: Types.ObjectId
): Promise<ConversationSchemaType | null> => {
    const id = normalizeObjectId(userId);

    return await Conversation.findOne({
        participants: [id],
    }).lean<ConversationSchemaType>();
};

export const conversationRepo = {
    getOrCreateConversation,
    findConversationById,
    findConverBetweenUsers,
    getAllConversationsForUser,
};