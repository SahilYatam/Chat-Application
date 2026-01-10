import { z } from "zod";
import { FriendRequestStatus } from "./friendRequest.model.js";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");


const sendFriendRequestSchema = z.object({
    receiverId: objectIdSchema,
});

const acceptFriendRequestSchema = z.object({
    requestId: objectIdSchema,
});

const rejectFriendRequestSchema = z.object({
    requestId: objectIdSchema,
});

export const friendRequestSchema = {
    sendFriendRequestSchema,
    acceptFriendRequestSchema,
    rejectFriendRequestSchema
}