import {z} from "zod";
import { chatSchema } from "./chat.schema.js";
import { Types } from "mongoose";
import { ChatEntity } from "./chat.repository.js";

// ============== Input Types ==============

export type SendMsgInput = z.infer<typeof chatSchema.sendMessageSchema>;

export type GetMessagesInput = z.infer<typeof chatSchema.getMessagesSchema>;

export type MarkMsgReadInput = z.infer<typeof chatSchema.markMessagesAsReadSchema>;

export type MsgEditParamInput = z.infer<typeof chatSchema.editMessageParamsSchema>;

export type MsgEditBodyInput = z.infer<typeof chatSchema.editMessageBodySchema>;

export type DeleteMsgInput = z.infer<typeof chatSchema.deleteMessageSchema>;

// ============== Return Types ==============

export type BaseMessageData = {
    chatId: Types.ObjectId;
    conversationId: Types.ObjectId;
    message: string;
    createdAt: Date;
}

export type GetMessagesResponse = {
  messages: ChatEntity[];
  nextCursor: Types.ObjectId | null;
};

export type MessageData = BaseMessageData;

export type DeleteMsgData = BaseMessageData & {
    isDeleted: boolean;
}

export type MarkMessagesAsRead = {
    read: true;
    updatedCount: number;
};
