import { z } from "zod";
import { objectIdSchema } from "../../shared/index.js";

const sendMessageSchema = z.object({
    receiverId: objectIdSchema,
    message: z.string().min(1, "Message cannot be empty"),
});

const markMessagesAsReadSchema = z.object({
    conversationId: objectIdSchema,
});

const editMessageParamsSchema = z.object({
    chatId: objectIdSchema,
    conversationId: objectIdSchema,
});

const editMessageBodySchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
});

const deleteMessageSchema = z.object({
    chatId: objectIdSchema,
    conversationId: objectIdSchema,
});

export const chatSchema = {
    sendMessageSchema,
    markMessagesAsReadSchema,
    editMessageParamsSchema,
    editMessageBodySchema,
    deleteMessageSchema,
}

