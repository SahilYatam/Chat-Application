import { Request, Response } from "express";
import { asyncHandler, ApiResponse } from "../../shared/index.js";
import { chatService } from "./chat.service.js";
import { chatSchema } from "./chat.schema.js";
import { normalizeObjectId } from "../../shared/index.js";

const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const senderId = req.user._id;
    const { receiverId, message } = chatSchema.sendMessageSchema.parse(req.body);

    const result = await chatService.sendMessage(senderId, {
        receiverId,
        message,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, result, "Message sent successfully"));
});

const getMessages = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user._id;
    const parsed = chatSchema.getMessagesSchema.parse({
        conversationId: req.params.conversationId,
        limit: req.query.limit,
        cursor: req.query.cursor,
    });

    const messages = await chatService.getMessages(currentUserId, {
        conversationId: parsed.conversationId,
        limit: parsed.limit,
        cursor: parsed.cursor,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

const markMessagesAsRead = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user._id;
    const { conversationId } = chatSchema.markMessagesAsReadSchema.parse(
        req.params,
    );
    const converId = normalizeObjectId(conversationId);

    const result = await chatService.markMessagesAsRead(converId, currentUserId);

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Messages marked as read"));
});

const editMessage = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user._id;
    const { chatId, conversationId } = chatSchema.editMessageParamsSchema.parse(
        req.params,
    );

    const { message } = chatSchema.editMessageBodySchema.parse(req.body);

    const result = await chatService.editMessage(
        {
            chatId,
            conversationId,
            message,
        },
        currentUserId,
    );

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Message edited successfully"));
});

const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user._id;
    const { chatId, conversationId } = chatSchema.deleteMessageSchema.parse(
        req.params,
    );

    const result = await chatService.deleteMessage(
        {
            chatId,
            conversationId,
        },
        currentUserId,
    );

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Messages deleted successfully"));
});

export const chatController = {
    sendMessage,
    getMessages,
    markMessagesAsRead,
    editMessage,
    deleteMessage,
};
