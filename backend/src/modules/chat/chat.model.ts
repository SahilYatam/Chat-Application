import { Schema, model, Types, HydratedDocument } from "mongoose";

export enum MessageType {
  TEXT = "text",
  FILE = "file",
  IMAGE = "image",
}

export interface ChatSchemaType {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    message: string;
    messageType?: MessageType;
    editedAt?: Date,
    read?: boolean;
    isDeleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type ChatDocument = HydratedDocument<ChatSchemaType>;

const chatSchema = new Schema <ChatSchemaType>({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },

    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    message: {
        type: String,
        trim: true,
        required: true,
    },

    messageType: {
        type: String,
        enum: Object.values(MessageType),
        default: MessageType.TEXT
    },

    editedAt: {
        type: Date,
        default: Date.now
    },

    read: {
        type: Boolean,
        default: false
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});

/**
 * Index for fast chat pagination
 */
chatSchema.index({conversationId: 1, createdAt: 1});

export const Chat = model<ChatSchemaType>("Chat", chatSchema);