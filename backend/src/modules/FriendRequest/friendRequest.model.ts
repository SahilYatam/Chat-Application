import { Schema, model, Types } from "mongoose";

export enum FriendRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

interface FriendRequestSchemaType {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    status: FriendRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}

const friendRequestSchema = new Schema<FriendRequestSchemaType>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: Object.values(FriendRequestStatus),
            default: FriendRequestStatus.PENDING
        },
    },
    { timestamps: true }
);

/**
 * Prevent duplicate friend requests
 * (same sender → same receiver)
 */

friendRequestSchema.index(
    {senderId: 1, receiverId: 1},
    {unique: true}
);

export const FriendRequest = model<FriendRequestSchemaType>(
    "FriendRequest",
    friendRequestSchema
);
