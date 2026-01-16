import { ClientSession, Types } from "mongoose";
import {
    FriendRequest,
    FriendRequestSchemaType,
    FriendRequestStatus,
    FriendRequestDocument,
} from "./friendRequest.model.js";
import { normalizeObjectId } from "../../shared/index.js";

type FriendRequestLean = FriendRequestSchemaType & {
    _id: Types.ObjectId;
};

export type FriendRequestEntity = {
    id: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    status: FriendRequestStatus;
    createdAt: Date;
    updatedAt: Date;
};

type FriendRequestUserField = "senderId" | "receiverId";

const findByUserField = async (
    field: FriendRequestUserField,
    userId: Types.ObjectId
): Promise<FriendRequestLean | null> => {
    return FriendRequest.findOne({ [field]: userId }).lean<FriendRequestLean>();
};

const findById = async (
    requestId: Types.ObjectId
): Promise<FriendRequestLean | null> => {
    return FriendRequest.findById(requestId).lean<FriendRequestLean>();
};

const findBetweenUsers = async (
    userA: Types.ObjectId,
    userB: Types.ObjectId
): Promise<FriendRequestLean | null> => {
    return FriendRequest.findOne({
        $or: [
            { senderId: userA, receiverId: userB },
            { senderId: userB, receiverId: userA },
        ],
    }).lean<FriendRequestLean>();
};

const createFriendRequest = async (
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId
): Promise<FriendRequestDocument> => {
    return FriendRequest.create({
        senderId,
        receiverId,
    });
};

const updateRequestStatus = async (
    requestId: Types.ObjectId,
    status: FriendRequestStatus.ACCEPTED | FriendRequestStatus.REJECTED,
    session?: ClientSession
): Promise<FriendRequestDocument | null> => {
    return FriendRequest.findByIdAndUpdate(
        requestId,
        { status },
        {
            session,
            new: true,
        }
    );
};

export const friendRequestRepo = {
    findByUserField,
    findById,
    findBetweenUsers,
    createFriendRequest,
    updateRequestStatus,
};
