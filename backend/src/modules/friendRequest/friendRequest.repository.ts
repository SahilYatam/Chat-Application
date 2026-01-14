import { ClientSession, Types } from "mongoose";
import {
    FriendRequest,
    FriendRequestSchemaType,
    FriendRequestStatus,
    FriendRequestDocument
} from "./friendRequest.model.js";
import { normalizeObjectId } from "../../shared/index.js";

type FriendRequestUserField = "senderId" | "receiverId";

const findByUserField = async (
    field: FriendRequestUserField,
    userId: string | Types.ObjectId
): Promise<FriendRequestSchemaType | null> => {
    const id = normalizeObjectId(userId);
    return FriendRequest.findOne({ [field]: id }).lean<FriendRequestSchemaType>();
};

const findById = async (
    requestId: Types.ObjectId
): Promise<FriendRequestSchemaType | null> => {
    const id = normalizeObjectId(requestId);
    return FriendRequest.findById(id).lean<FriendRequestSchemaType>();
};

const findBetweenUsers = async (
    userA: string | Types.ObjectId,
    userB: string | Types.ObjectId
): Promise<FriendRequestSchemaType | null> => {
    const a = normalizeObjectId(userA);
    const b = normalizeObjectId(userB);

    return FriendRequest.findOne({
        $or: [
            { senderId: a, receiverId: b },
            { senderId: b, receiverId: a },
        ],
    }).lean<FriendRequestSchemaType>();
};

const createFriendRequest = async (
    senderId: string | Types.ObjectId,
    receiverId: string | Types.ObjectId
): Promise<FriendRequestDocument> => {
    return FriendRequest.create({
        senderId: normalizeObjectId(senderId),
        receiverId: normalizeObjectId(receiverId),
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
