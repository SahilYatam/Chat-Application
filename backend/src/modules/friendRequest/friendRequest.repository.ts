import { ClientSession, Types } from "mongoose";
import {
    FriendRequest,
    FriendRequestDocument,
    FriendRequestStatus,
} from "./friendRequest.model.js";

type FriendRequestUserField = "senderId" | "receiverId";

const normalized = (id: string | Types.ObjectId): Types.ObjectId => {
    return typeof id === "string" ? new Types.ObjectId(id) : id;
};

const findByUserField = async (
    field: FriendRequestUserField,
    userId: string | Types.ObjectId
): Promise<FriendRequestDocument | null> => {
    const id = normalized(userId);
    return FriendRequest.findOne({ [field]: id });
};

const findById = async (
    requestId: Types.ObjectId
): Promise<FriendRequestDocument | null> => {
    const id = normalized(requestId);
    return FriendRequest.findById(id);
};

const findBetweenUsers = async (
    userA: string | Types.ObjectId,
    userB: string | Types.ObjectId
): Promise<FriendRequestDocument | null> => {
    const a = normalized(userA);
    const b = normalized(userB);

    return FriendRequest.findOne({
        $or: [
            { senderId: a, receiverId: b },
            { senderId: b, receiverId: a },
        ],
    });
};

const createFriendRequest = async (
    senderId: string | Types.ObjectId,
    receiverId: string | Types.ObjectId
): Promise<FriendRequestDocument> => {
    return FriendRequest.create({
        senderId: normalized(senderId),
        receiverId: normalized(receiverId),
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
