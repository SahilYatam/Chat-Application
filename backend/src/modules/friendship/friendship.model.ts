import { Schema, model, Types, HydratedDocument } from "mongoose";

export enum FriendshipStatus {
    ACTIVE = "active",
    BLOCKED = "blocked",
}

export interface FriendshipSchemaType {
    userA: Types.ObjectId;
    userB: Types.ObjectId;
    status: FriendshipStatus;
    createdBy: Types.ObjectId;
    blockedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export type FriendshipDocument = HydratedDocument<FriendshipSchemaType>;

const friendshipSchema = new Schema<FriendshipSchemaType>(
    {
        userA: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        userB: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(FriendshipStatus),
            default: FriendshipStatus.ACTIVE
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        blockedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        }

    },
    { timestamps: true }
);

friendshipSchema.index({userA: 1, userB: 1}, {unique: true});
friendshipSchema.index({userA: 1});
friendshipSchema.index({userB: 1});
friendshipSchema.index({blockedBy: 1});

export const Friendship = model<FriendshipSchemaType>("Friendship", friendshipSchema);