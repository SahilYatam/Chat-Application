import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface ConversationSchemaType {
    participants: Types.ObjectId[],
    createdAt: Date;
    updatedAt: Date;
}

export type ConversationDocument = HydratedDocument<ConversationSchemaType>

const conversationSchema = new Schema <ConversationSchemaType>({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ]
}, {timestamps: true});

conversationSchema.index(
    {participants: 1},
    {unique: true}
)

export const Conversation = model<ConversationSchemaType>("Conversation", conversationSchema);
