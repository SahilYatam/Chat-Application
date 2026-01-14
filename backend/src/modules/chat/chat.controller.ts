import { Request, Response } from "express";
import { asyncHandler, ApiResponse } from "../../shared/index.js";
import { chatService } from "./chat.service.js";
import { chatSchema } from "./chat.schema.js";

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

const markMessagesAsRead = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user._id;
    const { conversationId } = chatSchema.markMessagesAsReadSchema.parse(
        req.params
    );

    const result = await chatService.markMessagesAsRead(
        conversationId,
        currentUserId
    );

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Messages marked as read"));
});

const editMessage = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user._id;
    const { chatId, conversationId } = chatSchema.editMessageParamsSchema.parse(
        req.params
    );

    const { message } = chatSchema.editMessageBodySchema.parse(req.body);

    const result = await chatService.editMessage(
        {
            chatId,
            conversationId,
            message,
        },
        currentUserId
    );

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Message edited successfully"));
});

const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user._id;
    const { chatId, conversationId } = chatSchema.deleteMessageSchema.parse(
        req.params
    );

    const result = await chatService.deleteMessage(
        {
            chatId,
            conversationId,
        },
        currentUserId
    );

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Messages deleted successfully"));
});

export const chatController = {
    sendMessage,
    markMessagesAsRead,
    editMessage,
    deleteMessage,
};
