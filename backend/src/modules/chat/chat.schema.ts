import { z } from "zod";
import { objectIdSchema } from "../../shared/index.js";

const sendMessageSchema = z.object({
    receiverId: objectIdSchema,
    message: z.string().min(1, "Message cannot be empty"),
});

const getMessagesSchema = z.object({
  conversationId: objectIdSchema,

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),

  cursor: objectIdSchema.optional(),
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
    getMessagesSchema,
    markMessagesAsReadSchema,
    editMessageParamsSchema,
    editMessageBodySchema,
    deleteMessageSchema,
}

