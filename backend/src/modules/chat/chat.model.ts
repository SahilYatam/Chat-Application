import { Schema, model, Types } from "mongoose";

export enum MessageType {
  TEXT = "text",
  FILE = "file",
  IMAGE = "image",
}

interface ChatSchemaType {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    message: string;
    messageType: MessageType;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

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

    read: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});

/**
 * Index for fast chat pagination
 */
chatSchema.index({conversationId: 1, createdAt: 1});

export const Chat = model<ChatSchemaType>("Chat", chatSchema);