import {z} from "zod";
import { chatSchema } from "./chat.schema.js";
import { Types } from "mongoose";

// ============== Input Types ==============

export type SendMsgInput = z.infer<typeof chatSchema.sendMessageSchema>;


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

export type MessageData = BaseMessageData;

export type DeleteMsgData = BaseMessageData & {
    isDeleted: boolean;
}

export type MarkMessagesAsRead = {
    read: true;
    updatedCount: number;
};
