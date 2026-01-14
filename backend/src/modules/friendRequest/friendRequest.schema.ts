import { z } from "zod";

import { objectIdSchema } from "../../shared/index.js";


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