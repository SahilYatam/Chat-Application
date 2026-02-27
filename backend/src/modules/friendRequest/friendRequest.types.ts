import {z} from "zod";
import { friendRequestSchema } from "./friendRequest.schema.js";

export type SendFriendRequestInput = z.infer<typeof friendRequestSchema.sendFriendRequestSchema>;

export type GetFriendshipStatus =
    | "none"
    | "friends"
    | "pending_incoming"
    | "pending_outgoing"
    | "rejected";
