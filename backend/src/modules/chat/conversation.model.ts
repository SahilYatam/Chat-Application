import { Schema, model, Types } from "mongoose";

interface ConversationSchemaType {
    participants: Types.ObjectId[],
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema <ConversationSchemaType>({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ]
}, {timestamps: true});

/**
 * Prevent duplicate 1-to-1 conversations
 * (same two users)
 */

conversationSchema.index(
    {participants: 1},
    {unique: true}
)

export const Conversation = model<ConversationSchemaType>("Conversation", conversationSchema);
